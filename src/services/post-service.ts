import { prisma } from "@/lib/prisma";
import { ensureUniqueSlug, slugifyTitle } from "@/lib/slug";
import type { CreatePostInput, UpdatePostInput } from "@/lib/post-validation";
import { PostStatus, type Post } from "@prisma/client";

export type PostSummary = {
  id: string;
  title: string;
  slug: string;
  status: PostStatus;
  excerpt: string | null;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Lists all posts for a user, newest first.
 * Inputs: userId. Output: array of post summaries.
 */
export async function listPostsByUser(userId: string): Promise<PostSummary[]> {
  const posts = await prisma.post.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      excerpt: true,
      publishedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return posts;
}

/**
 * Fetches one post scoped to the owner.
 * Inputs: postId, userId. Output: full post or null if not found / not owned.
 */
export async function getPostByIdForUser(
  postId: string,
  userId: string,
): Promise<Post | null> {
  return prisma.post.findFirst({
    where: { id: postId, userId },
  });
}

/**
 * Resolves a unique slug for a user from title or explicit slug.
 * Inputs: userId, title, optional slug. Output: unique slug string.
 */
async function resolveSlug(
  userId: string,
  title: string,
  explicitSlug?: string,
): Promise<string> {
  const existing = await prisma.post.findMany({
    where: { userId },
    select: { slug: true },
  });
  const taken = new Set(existing.map((p) => p.slug));
  const base = explicitSlug?.trim() || slugifyTitle(title);
  return ensureUniqueSlug(base || "post", taken);
}

/**
 * Creates a post for the given user.
 * Inputs: userId, validated create input. Output: created post.
 */
export async function createPost(
  userId: string,
  input: CreatePostInput,
): Promise<Post> {
  const slug = await resolveSlug(userId, input.title, input.slug);
  const publishedAt =
    input.status === PostStatus.PUBLISHED ? new Date() : null;

  return prisma.post.create({
    data: {
      userId,
      title: input.title,
      slug,
      content: input.content,
      excerpt: input.excerpt ?? null,
      status: input.status,
      publishedAt,
    },
  });
}

/**
 * Updates a post owned by the user.
 * Inputs: postId, userId, patch. Output: updated post or null if not found.
 */
export async function updatePost(
  postId: string,
  userId: string,
  input: UpdatePostInput,
): Promise<Post | null> {
  const existing = await getPostByIdForUser(postId, userId);
  if (!existing) {
    return null;
  }

  let slug = existing.slug;
  if (input.slug && input.slug !== existing.slug) {
    const others = await prisma.post.findMany({
      where: { userId, id: { not: postId } },
      select: { slug: true },
    });
    const taken = new Set(others.map((p) => p.slug));
    slug = ensureUniqueSlug(input.slug, taken);
  }

  const nextStatus = input.status ?? existing.status;
  let publishedAt = existing.publishedAt;
  if (nextStatus === PostStatus.PUBLISHED && !publishedAt) {
    publishedAt = new Date();
  }
  if (nextStatus === PostStatus.DRAFT) {
    publishedAt = null;
  }

  return prisma.post.update({
    where: { id: postId },
    data: {
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.content !== undefined ? { content: input.content } : {}),
      ...(input.excerpt !== undefined ? { excerpt: input.excerpt } : {}),
      slug,
      status: nextStatus,
      publishedAt,
    },
  });
}

/**
 * Deletes a post owned by the user.
 * Inputs: postId, userId. Output: true if deleted, false if not found.
 */
export async function deletePost(
  postId: string,
  userId: string,
): Promise<boolean> {
  const existing = await getPostByIdForUser(postId, userId);
  if (!existing) {
    return false;
  }
  await prisma.post.delete({ where: { id: postId } });
  return true;
}
