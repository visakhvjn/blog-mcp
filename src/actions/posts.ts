"use server";

import { auth } from "@/auth";
import { createPostSchema, updatePostSchema } from "@/lib/post-validation";
import {
  createPost,
  deletePost,
  updatePost,
} from "@/services/post-service";
import { redirect } from "next/navigation";
import { z } from "zod";

export type PostFormState = {
  error?: string;
};

/**
 * Parses post fields from FormData for create/update forms.
 * Inputs: FormData. Output: parsed object or error message.
 */
function parsePostFormData(formData: FormData): {
  data?: z.infer<typeof createPostSchema>;
  error?: string;
} {
  const title = formData.get("title");
  const content = formData.get("content");
  const excerpt = formData.get("excerpt");
  const slug = formData.get("slug");
  const status = formData.get("status");

  if (typeof title !== "string" || typeof content !== "string") {
    return { error: "Title and content are required." };
  }

  const payload = {
    title,
    content,
    excerpt:
      typeof excerpt === "string" && excerpt.trim() ? excerpt.trim() : undefined,
    slug: typeof slug === "string" && slug.trim() ? slug.trim() : undefined,
    status: status === "PUBLISHED" ? ("PUBLISHED" as const) : ("DRAFT" as const),
  };

  try {
    return { data: createPostSchema.parse(payload) };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { error: err.issues[0]?.message ?? "Invalid input." };
    }
    return { error: "Invalid input." };
  }
}

/**
 * Creates a post and redirects to the posts list.
 * Inputs: previous state, FormData. Output: error state or redirect.
 */
export async function createPostAction(
  _prevState: PostFormState,
  formData: FormData,
): Promise<PostFormState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be signed in." };
  }

  const parsed = parsePostFormData(formData);
  if (parsed.error || !parsed.data) {
    return { error: parsed.error ?? "Invalid input." };
  }

  await createPost(session.user.id, parsed.data);
  redirect("/dashboard/posts");
}

/**
 * Updates a post and redirects to the posts list.
 * Inputs: postId, previous state, FormData. Output: error state or redirect.
 */
export async function updatePostAction(
  postId: string,
  _prevState: PostFormState,
  formData: FormData,
): Promise<PostFormState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be signed in." };
  }

  const parsed = parsePostFormData(formData);
  if (parsed.error || !parsed.data) {
    return { error: parsed.error ?? "Invalid input." };
  }

  let patch;
  try {
    patch = updatePostSchema.parse(parsed.data);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { error: err.issues[0]?.message ?? "Invalid input." };
    }
    return { error: "Invalid input." };
  }

  const post = await updatePost(postId, session.user.id, patch);
  if (!post) {
    return { error: "Post not found." };
  }

  redirect("/dashboard/posts");
}

/**
 * Deletes a post and redirects to the posts list.
 * Inputs: postId. Output: redirect.
 */
export async function deletePostAction(postId: string): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  await deletePost(postId, session.user.id);
  redirect("/dashboard/posts");
}
