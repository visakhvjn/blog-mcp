"use server";

import { auth } from "@/auth";
import { deleteTopic } from "@/services/topic-service";
import { redirect } from "next/navigation";

/**
 * Deletes a topic (posts are unlinked) and redirects to the topics list.
 * Inputs: topicId. Output: redirect.
 */
export async function deleteTopicAction(topicId: string): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  await deleteTopic(topicId, session.user.id);
  redirect("/dashboard/topics");
}
