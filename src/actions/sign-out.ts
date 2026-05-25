"use server";

import { signOut } from "@/auth";

/**
 * Signs the user out and redirects to the home page.
 * Inputs: none. Output: redirect via NextAuth signOut.
 */
export async function signOutAction(): Promise<void> {
  await signOut({ redirectTo: "/" });
}
