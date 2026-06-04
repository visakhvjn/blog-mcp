/**
 * Plain-text preview for list cards: excerpt first, otherwise content.
 */
export function getPostDescription(
  excerpt: string | null | undefined,
  content: string | null | undefined,
): string | null {
  const trimmedExcerpt = excerpt?.trim();
  if (trimmedExcerpt) {
    return trimmedExcerpt;
  }

  const trimmedContent = content?.trim();
  if (!trimmedContent) {
    return null;
  }

  const plain = trimmedContent
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^>\s?/gm, "")
    .replace(/^[-*+]\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();

  return plain || null;
}
