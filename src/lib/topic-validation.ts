import { z } from "zod";

export const topicNameSchema = z
  .string()
  .trim()
  .min(1, "Name is required")
  .max(100, "Name must be at most 100 characters");

export const createTopicSchema = z.object({
  name: topicNameSchema,
  description: z.string().max(500).optional(),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9-]+$/, "Invalid slug")
    .max(80)
    .optional(),
});

export const updateTopicSchema = z.object({
  name: topicNameSchema.optional(),
  description: z.string().max(500).nullable().optional(),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9-]+$/, "Invalid slug")
    .max(80)
    .optional(),
});

export type CreateTopicInput = z.infer<typeof createTopicSchema>;
export type UpdateTopicInput = z.infer<typeof updateTopicSchema>;
