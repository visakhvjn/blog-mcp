"use client";

import { deletePostAction } from "@/actions/posts";

type DeletePostButtonProps = {
  postId: string;
  postTitle: string;
};

/**
 * Confirms and deletes a post via server action.
 * Inputs: post id and title for confirm dialog. Output: delete button UI.
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
        className="text-sm text-red-600 hover:underline dark:text-red-400"
      >
        Delete
      </button>
    </form>
  );
}
