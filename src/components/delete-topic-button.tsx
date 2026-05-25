"use client";

import { deleteTopicAction } from "@/actions/topics";

type DeleteTopicButtonProps = {
  topicId: string;
  topicName: string;
};

/**
 * Confirms and deletes a topic; linked posts become uncategorized.
 */
export function DeleteTopicButton({
  topicId,
  topicName,
}: DeleteTopicButtonProps) {
  return (
    <form
      action={deleteTopicAction.bind(null, topicId)}
      onSubmit={(e) => {
        if (
          !confirm(
            `Delete topic "${topicName}"? Posts in this topic will stay published but no longer grouped.`,
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
