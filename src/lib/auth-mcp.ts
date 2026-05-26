import { createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose";
import {
  authenticateApiKey,
  type ApiKeyAuthResult,
} from "@/lib/auth-api-key";
import { isBlogApiKeyFormat } from "@/lib/api-key-crypto";
import { getAuth0Issuer } from "@/lib/app-base-url";
import { prisma } from "@/lib/prisma";
import { syncUserFromAuth0 } from "@/services/user-service";

/**
 * Authenticates MCP requests via API key or Auth0 access token (ChatGPT OAuth).
 */
export async function authenticateMcpRequest(
  request: Request,
): Promise<ApiKeyAuthResult | null> {
  const apiKey = await authenticateApiKey(request);
  if (apiKey) {
    return apiKey;
  }
  return authenticateAuth0AccessToken(request);
}

function getEmailFromToken(payload: JWTPayload): string | null {
  if (typeof payload.email === "string" && payload.email) {
    return payload.email;
  }
  const issuer = getAuth0Issuer();
  if (issuer) {
    const namespaced = payload[`${issuer}email`];
    if (typeof namespaced === "string" && namespaced) {
      return namespaced;
    }
  }
  return null;
}

async function fetchAuth0UserInfo(
  accessToken: string,
  domain: string,
): Promise<{ sub?: string; email?: string; name?: string; picture?: string } | null> {
  try {
    const res = await fetch(`https://${domain}/userinfo`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) {
      return null;
    }
    return (await res.json()) as {
      sub?: string;
      email?: string;
      name?: string;
      picture?: string;
    };
  } catch {
    return null;
  }
}

async function resolveUserForAuth0Token(
  payload: JWTPayload,
  accessToken: string,
  domain: string,
): Promise<ApiKeyAuthResult | null> {
  const sub = payload.sub;
  if (!sub) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { auth0Sub: sub },
    select: { id: true, username: true },
  });
  if (user) {
    return { userId: user.id, username: user.username };
  }

  let email = getEmailFromToken(payload);
  let name: string | null =
    typeof payload.name === "string" ? payload.name : null;
  let image: string | null =
    typeof payload.picture === "string" ? payload.picture : null;

  if (!email) {
    const profile = await fetchAuth0UserInfo(accessToken, domain);
    if (profile?.email) {
      email = profile.email;
      name = profile.name ?? name;
      image = profile.picture ?? image;
    }
  }

  if (!email) {
    return null;
  }

  const dbUser = await syncUserFromAuth0({
    auth0Sub: sub,
    email,
    name,
    image,
  });

  return { userId: dbUser.id, username: dbUser.username };
}

async function authenticateAuth0AccessToken(
  request: Request,
): Promise<ApiKeyAuthResult | null> {
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) {
    return null;
  }

  const token = header.slice(7).trim();
  if (!token || isBlogApiKeyFormat(token)) {
    return null;
  }

  const domain = process.env.AUTH0_DOMAIN;
  const audience = process.env.AUTH0_AUDIENCE;
  const issuer = getAuth0Issuer();
  if (!domain || !audience || !issuer) {
    return null;
  }

  try {
    const jwks = createRemoteJWKSet(
      new URL(`https://${domain}/.well-known/jwks.json`),
    );
    const { payload } = await jwtVerify(token, jwks, {
      issuer,
      audience,
    });

    return resolveUserForAuth0Token(payload, token, domain);
  } catch {
    return null;
  }
}
