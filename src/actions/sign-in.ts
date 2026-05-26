"use server";

import { signIn } from "@/auth";

/**
 * Starts Google OAuth sign-in.
 */
export async function signInWithGoogleAction(formData: FormData): Promise<void> {
  const callbackUrl = String(formData.get("callbackUrl") || "/dashboard");
  await signIn("google", { redirectTo: callbackUrl });
}
