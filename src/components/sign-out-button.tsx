"use client";

import { signOutAction } from "@/actions/sign-out";
import { FormSubmitButton } from "@/components/form-submit-button";

/**
 * Client button that triggers the sign-out server action.
 */
export function SignOutButton() {
  return (
    <form action={signOutAction}>
      <FormSubmitButton className="btn-ghost" pendingLabel="Signing out…">
        Sign out
      </FormSubmitButton>
    </form>
  );
}
