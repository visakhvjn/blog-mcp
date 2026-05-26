"use client";

import { deleteApiKeyAction } from "@/actions/api-keys";
import { FormSubmitButton } from "@/components/form-submit-button";

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
      <FormSubmitButton
        pendingLabel="Deleting…"
        className="text-sm font-medium text-[var(--danger)] hover:underline disabled:opacity-60"
      >
        Delete
      </FormSubmitButton>
    </form>
  );
}
