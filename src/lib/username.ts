import { z } from "zod";

/** Allowed username pattern for portfolio URLs (e.g. /{username}). */
export const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, "Username must be at least 3 characters")
  .max(30, "Username must be at most 30 characters")
  .regex(
    /^[a-z0-9-]+$/,
    "Use only lowercase letters, numbers, and hyphens",
  );

/**
 * Validates and normalizes a username string.
 * Inputs: raw username string. Output: normalized username or Zod error.
 */
export function parseUsername(raw: string): z.infer<typeof usernameSchema> {
  return usernameSchema.parse(raw);
}
