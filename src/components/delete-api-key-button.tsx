"use client";

import { deleteApiKeyAction } from "@/actions/api-keys";

type DeleteApiKeyButtonProps = {
  keyId: string;
  keyName: string;
};

/**
 * Deletes an API key after confirmation.
 */
export function DeleteApiKeyButton({ keyId, keyName }: DeleteApiKeyButtonProps) {
  return (
    <form
      action={deleteApiKeyAction.bind(null, keyId)}
      onSubmit={(e) => {
        if (
          !confirm(
            `Delete API key "${keyName}"? MCP clients using it will stop working.`,
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="text-sm font-medium text-[var(--danger)] hover:underline"
      >
        Delete
      </button>
    </form>
  );
}
