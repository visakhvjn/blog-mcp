import { PostStatus } from "@prisma/client";
import { z } from "zod";

const isoDateTime = z.string().describe("ISO 8601 datetime");

export const postSummarySchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  status: z.enum([PostStatus.DRAFT, PostStatus.PUBLISHED]),
  excerpt: z.string().nullable(),
  topicId: z.string().nullable(),
  topicName: z.string().nullable(),
  topicSlug: z.string().nullable(),
  publishedAt: isoDateTime.nullable(),
  createdAt: isoDateTime,
  updatedAt: isoDateTime,
});

export const postSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string(),
  slug: z.string(),
  content: z.string(),
  excerpt: z.string().nullable(),
  status: z.enum([PostStatus.DRAFT, PostStatus.PUBLISHED]),
  topicId: z.string().nullable(),
  publishedAt: isoDateTime.nullable(),
  createdAt: isoDateTime,
  updatedAt: isoDateTime,
});

export const topicSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  postCount: z.number().int(),
  createdAt: isoDateTime,
  updatedAt: isoDateTime,
});

export const topicSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  createdAt: isoDateTime,
  updatedAt: isoDateTime,
});

export const listPostsOutputSchema = z.object({
  posts: z.array(postSummarySchema),
});

export const getPostOutputSchema = z.object({
  post: postSchema,
  publicUrl: z.string().nullable(),
});

export const listTopicsOutputSchema = z.object({
  topics: z.array(topicSummarySchema),
});

export const createTopicOutputSchema = z.object({
  topic: topicSchema,
  publicUrl: z.string().nullable(),
});

export const createPostOutputSchema = getPostOutputSchema;

export const updatePostOutputSchema = getPostOutputSchema;

export const deleteOutputSchema = z.object({
  ok: z.literal(true),
  deletedId: z.string(),
});

/** JSON round-trip so Date values match ISO string output schemas. */
export function toMcpStructured<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
