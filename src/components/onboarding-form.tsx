"use client";

import { setUsername, type SetUsernameState } from "@/actions/set-username";
import { ActionSubmitButton } from "@/components/action-submit-button";
import { useActionState } from "react";

const initialState: SetUsernameState = {};

/**
 * Form for choosing a unique username during onboarding.
 */
export function OnboardingForm() {
  const [state, formAction, pending] = useActionState(setUsername, initialState);

  return (
    <form action={formAction} className="card flex w-full max-w-md flex-col gap-5 p-6">
      <div>
        <label htmlFor="username" className="label">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          required
          autoComplete="username"
          placeholder="your-name"
          className="input font-mono"
        />
        <p className="mt-2 text-xs text-muted">
          3–30 characters, lowercase letters, numbers, and hyphens only.
        </p>
      </div>

      {state.error ? (
        <p className="text-sm text-[var(--danger)]" role="alert">
          {state.error}
        </p>
      ) : null}

      <ActionSubmitButton
        pending={pending}
        pendingLabel="Saving…"
        className="btn-primary"
      >
        Continue
      </ActionSubmitButton>
    </form>
  );
}
