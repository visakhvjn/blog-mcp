import { generateApiKeyMaterial } from "@/lib/api-key-crypto";
import { prisma } from "@/lib/prisma";

export type ApiKeyListItem = {
  id: string;
  name: string;
  keyPrefix: string;
  lastUsedAt: Date | null;
  createdAt: Date;
};

/**
 * Lists active API keys for a user (no secrets).
 * Inputs: userId. Output: key metadata rows.
 */
export async function listApiKeysForUser(
  userId: string,
): Promise<ApiKeyListItem[]> {
  return prisma.apiKey.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      keyPrefix: true,
      lastUsedAt: true,
      createdAt: true,
    },
  });
}

/**
 * Creates a new API key; returns the full key once.
 * Inputs: userId, display name. Output: full key string and record id.
 */
export async function createApiKeyForUser(
  userId: string,
  name: string,
): Promise<{ id: string; fullKey: string }> {
  const trimmedName = name.trim();
  if (!trimmedName) {
    throw new Error("Name is required.");
  }

  const { fullKey, keyLookup, keyPrefix } = generateApiKeyMaterial();

  const record = await prisma.apiKey.create({
    data: {
      userId,
      name: trimmedName,
      keyLookup,
      keyPrefix,
    },
  });

  return { id: record.id, fullKey };
}

/**
 * Revokes an API key owned by the user.
 * Inputs: keyId, userId. Output: true if revoked, false if not found.
 */
export async function revokeApiKeyForUser(
  keyId: string,
  userId: string,
): Promise<boolean> {
  const existing = await prisma.apiKey.findFirst({
    where: { id: keyId, userId },
  });
  if (!existing || existing.revokedAt) {
    return false;
  }
  await prisma.apiKey.update({
    where: { id: keyId },
    data: { revokedAt: new Date() },
  });
  return true;
}

/**
 * Permanently deletes an API key owned by the user.
 * Inputs: keyId, userId. Output: true if deleted, false if not found.
 */
export async function deleteApiKeyForUser(
  keyId: string,
  userId: string,
): Promise<boolean> {
  const result = await prisma.apiKey.deleteMany({
    where: { id: keyId, userId },
  });
  return result.count > 0;
}
