"use client";

import { deletePostAction } from "@/actions/posts";
import { FormSubmitButton } from "@/components/form-submit-button";

type DeletePostButtonProps = {
  postId: string;
  postTitle: string;
};

/**
 * Confirms and deletes a post via server action.
 */
export function DeletePostButton({ postId, postTitle }: DeletePostButtonProps) {
  return (
    <form
      action={deletePostAction.bind(null, postId)}
      onSubmit={(e) => {
        if (
          !confirm(`Delete "${postTitle}"? This cannot be undone.`)
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
