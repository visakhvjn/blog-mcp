import { prisma } from "@/lib/prisma";
import { ensureUniqueSlug, slugifyTitle } from "@/lib/slug";
import type { CreatePostInput, UpdatePostInput } from "@/lib/post-validation";
import { resolveTopicIdForUser } from "@/services/topic-service";
import { PostStatus, type Post } from "@prisma/client";

export type PostSummary = {
  id: string;
  title: string;
  slug: string;
  status: PostStatus;
  excerpt: string | null;
  topicId: string | null;
  topicName: string | null;
  topicSlug: string | null;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Lists all posts for a user, newest first.
 * Inputs: userId. Output: array of post summaries.
 */
export type ListPostsOptions = {
  status?: PostStatus;
  topicId?: string | null;
  limit?: number;
};

/**
 * Lists posts for a user with optional status filter and limit.
 * Inputs: userId, optional filter/limit. Output: post summaries.
 */
export async function listPostsByUser(
  userId: string,
  options?: ListPostsOptions,
): Promise<PostSummary[]> {
  const posts = await prisma.post.findMany({
    where: {
      userId,
      ...(options?.status ? { status: options.status } : {}),
      ...(options?.topicId === null
        ? { topicId: null }
        : options?.topicId
          ? { topicId: options.topicId }
          : {}),
    },
    orderBy: { updatedAt: "desc" },
    take: options?.limit ?? 100,
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      excerpt: true,
      topicId: true,
      topic: { select: { name: true, slug: true } },
      publishedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return posts.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    status: p.status,
    excerpt: p.excerpt,
    topicId: p.topicId,
    topicName: p.topic?.name ?? null,
    topicSlug: p.topic?.slug ?? null,
    publishedAt: p.publishedAt,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  }));
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
 * Fetches one post by slug scoped to the owner.
 * Inputs: slug, userId. Output: full post or null.
 */
export async function getPostBySlugForUser(
  slug: string,
  userId: string,
): Promise<Post | null> {
  return prisma.post.findFirst({
    where: { slug, userId },
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
  const topicId = await resolveTopicIdForUser(userId, input.topicId);

  return prisma.post.create({
    data: {
      userId,
      topicId,
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

  let topicId: string | null | undefined;
  if (input.topicId !== undefined) {
    topicId = await resolveTopicIdForUser(userId, input.topicId);
  }

  return prisma.post.update({
    where: { id: postId },
    data: {
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.content !== undefined ? { content: input.content } : {}),
      ...(input.excerpt !== undefined ? { excerpt: input.excerpt } : {}),
      ...(topicId !== undefined ? { topicId } : {}),
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
