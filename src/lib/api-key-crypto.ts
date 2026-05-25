import { createHash, randomBytes } from "crypto";

const KEY_PREFIX = "blog_";

/**
 * SHA-256 hex digest of the full API key for database lookup.
 * Inputs: full API key string. Output: hex hash.
 */
export function hashApiKey(fullKey: string): string {
  return createHash("sha256").update(fullKey).digest("hex");
}

/**
 * Generates a new random API key and its stored lookup metadata.
 * Inputs: none. Output: full key (show once), lookup hash, display prefix.
 */
export function generateApiKeyMaterial(): {
  fullKey: string;
  keyLookup: string;
  keyPrefix: string;
} {
  const secret = randomBytes(32).toString("base64url");
  const fullKey = `${KEY_PREFIX}${secret}`;
  return {
    fullKey,
    keyLookup: hashApiKey(fullKey),
    keyPrefix: fullKey.slice(0, 16),
  };
}

/**
 * Returns true if the string looks like a blog MCP API key.
 * Inputs: token string. Output: boolean.
 */
export function isBlogApiKeyFormat(token: string): boolean {
  return token.startsWith(KEY_PREFIX) && token.length > KEY_PREFIX.length + 20;
}
