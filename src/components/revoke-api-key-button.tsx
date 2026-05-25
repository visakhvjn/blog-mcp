"use client";

import { revokeApiKeyAction } from "@/actions/api-keys";

type RevokeApiKeyButtonProps = {
  keyId: string;
  keyName: string;
};

/**
 * Revokes an API key after confirmation.
 */
export function RevokeApiKeyButton({ keyId, keyName }: RevokeApiKeyButtonProps) {
  return (
    <form
      action={revokeApiKeyAction.bind(null, keyId)}
      onSubmit={(e) => {
        if (
          !confirm(
            `Revoke API key "${keyName}"? MCP clients using it will stop working.`,
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
        Revoke
      </button>
    </form>
  );
}
