"use server";

import { auth } from "@/auth";
import { deletePost } from "@/services/post-service";
import { redirect } from "next/navigation";

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
