/**
 * Converts a title into a URL-safe slug (lowercase, hyphens).
 * Inputs: title string. Output: slug string.
 */
export function slugifyTitle(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/**
 * Appends -2, -3, … until the slug is not in `existingSlugs`.
 * Inputs: base slug, set of taken slugs. Output: unique slug for this user.
 */
export function ensureUniqueSlug(
  base: string,
  existingSlugs: Set<string>,
): string {
  const root = base || "post";
  if (!existingSlugs.has(root)) {
    return root;
  }
  let n = 2;
  while (existingSlugs.has(`${root}-${n}`)) {
    n += 1;
  }
  return `${root}-${n}`;
}
