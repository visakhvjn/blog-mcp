import { createRemoteJWKSet, jwtVerify } from "jose";
import {
  authenticateApiKey,
  type ApiKeyAuthResult,
} from "@/lib/auth-api-key";
import { isBlogApiKeyFormat } from "@/lib/api-key-crypto";
import { getAuth0Issuer } from "@/lib/app-base-url";
import { prisma } from "@/lib/prisma";

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

    const sub = payload.sub;
    if (!sub) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { auth0Sub: sub },
      select: { id: true, username: true },
    });
    if (!user) {
      return null;
    }

    return { userId: user.id, username: user.username };
  } catch {
    return null;
  }
}
