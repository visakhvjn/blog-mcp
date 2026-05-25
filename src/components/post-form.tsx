"use client";

import {
  createPostAction,
  updatePostAction,
  type PostFormState,
} from "@/actions/posts";
import { PostStatus, type Post } from "@prisma/client";
import { useActionState } from "react";

const initialState: PostFormState = {};

type PostFormProps = {
  mode: "create" | "edit";
  post?: Post;
};

/**
 * Markdown post create/edit form using server actions.
 * Inputs: mode and optional existing post. Output: form UI.
 */
export function PostForm({ mode, post }: PostFormProps) {
  const action =
    mode === "create"
      ? createPostAction
      : updatePostAction.bind(null, post!.id);

  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-5">
      <div>
        <label
          htmlFor="title"
          className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={post?.title ?? ""}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
        />
      </div>

      <div>
        <label
          htmlFor="slug"
          className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Slug <span className="font-normal text-zinc-500">(optional)</span>
        </label>
        <input
          id="slug"
          name="slug"
          type="text"
          placeholder="auto-from-title"
          defaultValue={post?.slug ?? ""}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-zinc-900 outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
        />
      </div>

      <div>
        <label
          htmlFor="excerpt"
          className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Excerpt <span className="font-normal text-zinc-500">(optional)</span>
        </label>
        <input
          id="excerpt"
          name="excerpt"
          type="text"
          defaultValue={post?.excerpt ?? ""}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
        />
      </div>

      <div>
        <label
          htmlFor="content"
          className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Content <span className="font-normal text-zinc-500">(Markdown)</span>
        </label>
        <textarea
          id="content"
          name="content"
          required
          rows={14}
          defaultValue={post?.content ?? ""}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-zinc-900 outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
        />
      </div>

      <div>
        <label
          htmlFor="status"
          className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Status
        </label>
        <select
          id="status"
          name="status"
          defaultValue={post?.status ?? PostStatus.DRAFT}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
        >
          <option value={PostStatus.DRAFT}>Draft</option>
          <option value={PostStatus.PUBLISHED}>Published</option>
        </select>
      </div>

      {state.error ? (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {state.error}
        </p>
      ) : null}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
        >
          {pending
            ? "Saving…"
            : mode === "create"
              ? "Create post"
              : "Save changes"}
        </button>
      </div>
    </form>
  );
}
