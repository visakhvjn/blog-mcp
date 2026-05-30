/** Paths that must not be treated as portfolio usernames. */
const RESERVED = new Set([
  "login",
  "onboarding",
  "dashboard",
  "api",
  "posts",
  "topics",
  "settings",
  "profile",
  "docs",
  "openapi",
  "_next",
  "favicon.ico",
]);

/**
 * Returns true if the segment is a reserved app route, not a username.
 * Inputs: username slug from URL. Output: boolean.
 */
export function isReservedUsername(segment: string): boolean {
  return RESERVED.has(segment.toLowerCase());
}
