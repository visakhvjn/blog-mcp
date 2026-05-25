import { prisma } from "@/lib/prisma";
import { ensureUniqueSlug, slugifyTitle } from "@/lib/slug";
import type { CreateTopicInput, UpdateTopicInput } from "@/lib/topic-validation";
import type { Topic } from "@prisma/client";

export type TopicSummary = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  postCount: number;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Lists all topics for a user with post counts.
 * Inputs: userId. Output: topic summaries.
 */
export async function listTopicsByUser(userId: string): Promise<TopicSummary[]> {
  const topics = await prisma.topic.findMany({
    where: { userId },
    orderBy: { name: "asc" },
    include: { _count: { select: { posts: true } } },
  });

  return topics.map((t) => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
    description: t.description,
    postCount: t._count.posts,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
  }));
}

/**
 * Lists topics as id/name/slug only (for dropdowns).
 * Inputs: userId. Output: minimal topic rows.
 */
export async function listTopicOptionsForUser(
  userId: string,
): Promise<Array<{ id: string; name: string; slug: string }>> {
  return prisma.topic.findMany({
    where: { userId },
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true },
  });
}

/**
 * Fetches one topic owned by the user.
 * Inputs: topicId, userId. Output: topic or null.
 */
export async function getTopicByIdForUser(
  topicId: string,
  userId: string,
): Promise<Topic | null> {
  return prisma.topic.findFirst({
    where: { id: topicId, userId },
  });
}

/**
 * Fetches one topic by slug for the user.
 * Inputs: slug, userId. Output: topic or null.
 */
export async function getTopicBySlugForUser(
  slug: string,
  userId: string,
): Promise<Topic | null> {
  return prisma.topic.findFirst({
    where: { slug, userId },
  });
}

/**
 * Resolves a unique topic slug for the user.
 * Inputs: userId, name, optional slug. Output: slug string.
 */
async function resolveTopicSlug(
  userId: string,
  name: string,
  explicitSlug?: string,
): Promise<string> {
  const existing = await prisma.topic.findMany({
    where: { userId },
    select: { slug: true },
  });
  const taken = new Set(existing.map((t) => t.slug));
  const base = explicitSlug?.trim() || slugifyTitle(name);
  return ensureUniqueSlug(base || "topic", taken);
}

/**
 * Creates a topic for the user.
 * Inputs: userId, validated input. Output: created topic.
 */
export async function createTopic(
  userId: string,
  input: CreateTopicInput,
): Promise<Topic> {
  const slug = await resolveTopicSlug(userId, input.name, input.slug);

  return prisma.topic.create({
    data: {
      userId,
      name: input.name,
      slug,
      description: input.description ?? null,
    },
  });
}

/**
 * Updates a topic owned by the user.
 * Inputs: topicId, userId, patch. Output: updated topic or null.
 */
export async function updateTopic(
  topicId: string,
  userId: string,
  input: UpdateTopicInput,
): Promise<Topic | null> {
  const existing = await getTopicByIdForUser(topicId, userId);
  if (!existing) {
    return null;
  }

  let slug = existing.slug;
  if (input.slug && input.slug !== existing.slug) {
    const others = await prisma.topic.findMany({
      where: { userId, id: { not: topicId } },
      select: { slug: true },
    });
    const taken = new Set(others.map((t) => t.slug));
    slug = ensureUniqueSlug(input.slug, taken);
  }

  return prisma.topic.update({
    where: { id: topicId },
    data: {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.description !== undefined
        ? { description: input.description }
        : {}),
      slug,
    },
  });
}

/**
 * Deletes a topic; posts are unlinked (topicId set null).
 * Inputs: topicId, userId. Output: true if deleted.
 */
export async function deleteTopic(
  topicId: string,
  userId: string,
): Promise<boolean> {
  const existing = await getTopicByIdForUser(topicId, userId);
  if (!existing) {
    return false;
  }
  await prisma.topic.delete({ where: { id: topicId } });
  return true;
}

/**
 * Validates topicId belongs to user; returns null if topicId is null/empty.
 * Inputs: userId, optional topicId. Output: resolved id or null; throws if invalid.
 */
export async function resolveTopicIdForUser(
  userId: string,
  topicId: string | null | undefined,
): Promise<string | null> {
  if (!topicId || topicId.trim() === "") {
    return null;
  }
  const topic = await getTopicByIdForUser(topicId, userId);
  if (!topic) {
    throw new Error("Topic not found.");
  }
  return topic.id;
}

/**
 * Resolves topic by id or slug for MCP/API callers.
 * Inputs: userId, optional id or slug (slug wins if both). Output: topic id or null.
 */
export async function resolveTopicRefForUser(
  userId: string,
  opts: { topicId?: string; topicSlug?: string },
): Promise<string | null> {
  if (opts.topicSlug?.trim()) {
    const topic = await getTopicBySlugForUser(opts.topicSlug.trim(), userId);
    if (!topic) {
      throw new Error("Topic not found.");
    }
    return topic.id;
  }
  return resolveTopicIdForUser(userId, opts.topicId);
}
