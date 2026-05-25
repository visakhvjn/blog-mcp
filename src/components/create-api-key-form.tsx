"use client";

import {
  createApiKeyAction,
  type CreateApiKeyState,
} from "@/actions/api-keys";
import { useActionState, useState } from "react";

const initialState: CreateApiKeyState = {};

/**
 * Form to generate a new MCP API key; shows the secret once after creation.
 */
export function CreateApiKeyForm() {
  const [state, formAction, pending] = useActionState(
    createApiKeyAction,
    initialState,
  );
  const [copied, setCopied] = useState(false);

  if (state.fullKey) {
    return (
      <div className="alert-warning">
        <p className="alert-warning-title">
          Copy your API key now — it will not be shown again.
        </p>
        <p className="mt-1 text-xs text-secondary">Key: {state.name}</p>
        <code className="mt-3 block break-all rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-3 font-mono text-xs text-[var(--text)]">
          {state.fullKey}
        </code>
        <button
          type="button"
          onClick={async () => {
            await navigator.clipboard.writeText(state.fullKey!);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className="btn-primary mt-3"
        >
          {copied ? "Copied" : "Copy key"}
        </button>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="flex flex-col gap-3 sm:flex-row sm:items-end"
    >
      <div className="flex-1">
        <label htmlFor="key-name" className="label">
          Key name
        </label>
        <input
          id="key-name"
          name="name"
          type="text"
          required
          placeholder="e.g. Cursor laptop"
          className="input"
        />
      </div>
      <button type="submit" disabled={pending} className="btn-primary">
        {pending ? "Creating…" : "Generate API key"}
      </button>
      {state.error ? (
        <p className="text-sm text-[var(--danger)] sm:basis-full">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
