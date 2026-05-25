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
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/30">
        <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
          Copy your API key now — it will not be shown again.
        </p>
        <p className="mt-1 text-xs text-amber-800/80 dark:text-amber-300/80">
          Key: {state.name}
        </p>
        <code className="mt-3 block break-all rounded-lg bg-white/80 p-3 font-mono text-xs text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
          {state.fullKey}
        </code>
        <button
          type="button"
          onClick={async () => {
            await navigator.clipboard.writeText(state.fullKey!);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className="mt-3 rounded-lg bg-zinc-900 px-3 py-1.5 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900"
        >
          {copied ? "Copied" : "Copy key"}
        </button>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="flex-1">
        <label
          htmlFor="key-name"
          className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Key name
        </label>
        <input
          id="key-name"
          name="name"
          type="text"
          required
          placeholder="e.g. Cursor laptop"
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-900"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
      >
        {pending ? "Creating…" : "Generate API key"}
      </button>
      {state.error ? (
        <p className="text-sm text-red-600 sm:basis-full">{state.error}</p>
      ) : null}
    </form>
  );
}
