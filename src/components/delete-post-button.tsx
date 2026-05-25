"use client";

import { deletePostAction } from "@/actions/posts";

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
      <button
        type="submit"
        className="text-sm font-medium text-[var(--danger)] hover:underline"
      >
        Delete
      </button>
    </form>
  );
}
