"use client";

import { setUsername, type SetUsernameState } from "@/actions/set-username";
import { useActionState } from "react";

const initialState: SetUsernameState = {};

/**
 * Form for choosing a unique username during onboarding.
 * Inputs: none. Output: username form UI with validation errors.
 */
export function OnboardingForm() {
  const [state, formAction, pending] = useActionState(setUsername, initialState);

  return (
    <form action={formAction} className="flex w-full max-w-md flex-col gap-4">
      <div>
        <label
          htmlFor="username"
          className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          required
          autoComplete="username"
          placeholder="your-name"
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
        />
        <p className="mt-1 text-xs text-zinc-500">
          3–30 characters, lowercase letters, numbers, and hyphens only.
        </p>
      </div>

      {state.error ? (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
      >
        {pending ? "Saving…" : "Continue"}
      </button>
    </form>
  );
}
