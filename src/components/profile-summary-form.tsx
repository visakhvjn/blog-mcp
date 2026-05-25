"use client";

import {
  updateProfileAction,
  type ProfileFormState,
} from "@/actions/profile";
import { useActionState } from "react";

const initialState: ProfileFormState = {};

type ProfileSummaryFormProps = {
  summary: string | null;
};

/**
 * Form to edit the public profile summary (bio).
 * Inputs: current summary. Output: textarea form with save feedback.
 */
export function ProfileSummaryForm({ summary }: ProfileSummaryFormProps) {
  const [state, formAction, pending] = useActionState(
    updateProfileAction,
    initialState,
  );

  return (
    <form action={formAction} className="card flex w-full flex-col gap-5 p-6">
      <div>
        <label htmlFor="summary" className="label">
          About you
        </label>
        <p className="mb-3 text-sm text-secondary">
          Shown on your public blog. A few sentences about who you are and what
          you write about.
        </p>
        <textarea
          id="summary"
          name="summary"
          rows={5}
          maxLength={500}
          defaultValue={summary ?? ""}
          placeholder="Writer, developer, …"
          className="input resize-y leading-relaxed"
        />
        <p className="mt-2 text-xs text-muted">Up to 500 characters.</p>
      </div>

      {state.error ? (
        <p className="text-sm text-[var(--danger)]" role="alert">
          {state.error}
        </p>
      ) : null}

      {state.success ? (
        <p className="text-sm text-[var(--accent)]" role="status">
          Profile saved.
        </p>
      ) : null}

      <button type="submit" disabled={pending} className="btn-primary w-fit">
        {pending ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}
