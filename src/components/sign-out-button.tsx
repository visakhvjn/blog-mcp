"use client";

import { signOutAction } from "@/actions/sign-out";

/**
 * Client button that triggers the sign-out server action.
 * Inputs: none. Output: rendered button element.
 */
export function SignOutButton() {
  return (
    <form action={signOutAction}>
      <button
        type="submit"
        className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
      >
        Sign out
      </button>
    </form>
  );
}
