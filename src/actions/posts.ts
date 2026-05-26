"use server";

import { getAppSession } from "@/lib/app-session";
import { deletePost } from "@/services/post-service";
import { redirect } from "next/navigation";

/**
 * Deletes a post and redirects to the posts list.
 * Inputs: postId. Output: redirect.
 */
export async function deletePostAction(postId: string): Promise<void> {
  const session = await getAppSession();
  if (!session?.user?.id) {
    redirect("/auth/login?returnTo=/dashboard");
  }

  await deletePost(postId, session.user.id);
  redirect("/dashboard/posts");
}
