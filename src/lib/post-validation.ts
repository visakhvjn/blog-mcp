import { PostStatus } from "@prisma/client";
import { z } from "zod";

export const postTitleSchema = z
  .string()
  .trim()
  .min(1, "Title is required")
  .max(200, "Title must be at most 200 characters");

export const postContentSchema = z
  .string()
  .min(1, "Content is required")
  .max(100_000, "Content is too long");

export const postStatusSchema = z.enum([PostStatus.DRAFT, PostStatus.PUBLISHED]);

export const createPostSchema = z.object({
  title: postTitleSchema,
  content: postContentSchema,
  excerpt: z.string().max(500).optional(),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9-]+$/, "Invalid slug")
    .max(80)
    .optional(),
  status: postStatusSchema.default(PostStatus.DRAFT),
  topicId: z.string().optional(),
});

export const updatePostSchema = z.object({
  title: postTitleSchema.optional(),
  content: postContentSchema.optional(),
  excerpt: z.string().max(500).nullable().optional(),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9-]+$/, "Invalid slug")
    .max(80)
    .optional(),
  status: postStatusSchema.optional(),
  topicId: z.string().nullable().optional(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
