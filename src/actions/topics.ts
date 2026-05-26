"use server";

import { getAppSession } from "@/lib/app-session";
import { deleteTopic } from "@/services/topic-service";
import { redirect } from "next/navigation";

/**
 * Deletes a topic (posts are unlinked) and redirects to the topics list.
 * Inputs: topicId. Output: redirect.
 */
export async function deleteTopicAction(topicId: string): Promise<void> {
  const session = await getAppSession();
  if (!session?.user?.id) {
    redirect("/auth/login?returnTo=/dashboard");
  }

  await deleteTopic(topicId, session.user.id);
  redirect("/dashboard/topics");
}
