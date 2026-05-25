"use client";

import { signOutAction } from "@/actions/sign-out";

/**
 * Client button that triggers the sign-out server action.
 */
export function SignOutButton() {
  return (
    <form action={signOutAction}>
      <button type="submit" className="btn-ghost">
        Sign out
      </button>
    </form>
  );
}
