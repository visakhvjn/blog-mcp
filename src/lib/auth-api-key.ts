import { hashApiKey, isBlogApiKeyFormat } from "@/lib/api-key-crypto";
import { prisma } from "@/lib/prisma";

export type ApiKeyAuthResult = {
  userId: string;
  username: string | null;
};

/**
 * Authenticates a Bearer API key from the Authorization header.
 * Inputs: Request or raw token. Output: user context or null.
 */
export async function authenticateApiKey(
  request: Request,
): Promise<ApiKeyAuthResult | null> {
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) {
    return null;
  }
  const token = header.slice(7).trim();
  return authenticateApiKeyToken(token);
}

/**
 * Validates a raw API key token against stored hashes.
 * Inputs: full API key string. Output: user context or null.
 */
export async function authenticateApiKeyToken(
  token: string,
): Promise<ApiKeyAuthResult | null> {
  if (!isBlogApiKeyFormat(token)) {
    return null;
  }

  const keyLookup = hashApiKey(token);
  const apiKey = await prisma.apiKey.findFirst({
    where: { keyLookup },
    include: { user: { select: { id: true, username: true } } },
  });

  if (!apiKey || apiKey.revokedAt) {
    return null;
  }

  await prisma.apiKey.update({
    where: { id: apiKey.id },
    data: { lastUsedAt: new Date() },
  });

  return {
    userId: apiKey.user.id,
    username: apiKey.user.username,
  };
}
