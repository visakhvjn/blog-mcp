import { z } from "zod";

export const userSummarySchema = z
  .string()
  .trim()
  .max(500, "Summary must be at most 500 characters");

export const updateProfileSchema = z.object({
  summary: userSummarySchema.optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
