"use server";

import { auth } from "@/auth";
import { updateProfileSchema } from "@/lib/user-validation";
import { updateUserProfile } from "@/services/user-service";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export type ProfileFormState = {
  error?: string;
  success?: boolean;
};

/**
 * Saves the user's public profile summary.
 * Inputs: previous state, FormData. Output: form state with error or success.
 */
export async function updateProfileAction(
  _prevState: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const session = await auth();
  if (!session?.user?.id || !session.user.username) {
    return { error: "You must be signed in." };
  }

  const summaryRaw = formData.get("summary");
  const summary = typeof summaryRaw === "string" ? summaryRaw : "";

  let input;
  try {
    input = updateProfileSchema.parse({ summary });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { error: err.issues[0]?.message ?? "Invalid input." };
    }
    return { error: "Invalid input." };
  }

  const profile = await updateUserProfile(session.user.id, input);
  if (!profile) {
    return { error: "Profile not found." };
  }

  revalidatePath(`/${profile.username}`);
  revalidatePath("/dashboard/profile");

  return { success: true };
}
