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
 */
export function PostForm({ mode, post }: PostFormProps) {
  const action =
    mode === "create"
      ? createPostAction
      : updatePostAction.bind(null, post!.id);

  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="card flex max-w-2xl flex-col gap-5 p-6">
      <div>
        <label htmlFor="title" className="label">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={post?.title ?? ""}
          className="input"
        />
      </div>

      <div>
        <label htmlFor="slug" className="label">
          Slug <span className="font-normal text-muted">(optional)</span>
        </label>
        <input
          id="slug"
          name="slug"
          type="text"
          placeholder="auto-from-title"
          defaultValue={post?.slug ?? ""}
          className="input font-mono text-sm"
        />
      </div>

      <div>
        <label htmlFor="excerpt" className="label">
          Excerpt <span className="font-normal text-muted">(optional)</span>
        </label>
        <input
          id="excerpt"
          name="excerpt"
          type="text"
          defaultValue={post?.excerpt ?? ""}
          className="input"
        />
      </div>

      <div>
        <label htmlFor="content" className="label">
          Content <span className="font-normal text-muted">(Markdown)</span>
        </label>
        <textarea
          id="content"
          name="content"
          required
          rows={14}
          defaultValue={post?.content ?? ""}
          className="input min-h-[280px] resize-y font-mono text-sm leading-relaxed"
        />
      </div>

      <div>
        <label htmlFor="status" className="label">
          Status
        </label>
        <select
          id="status"
          name="status"
          defaultValue={post?.status ?? PostStatus.DRAFT}
          className="input"
        >
          <option value={PostStatus.DRAFT}>Draft</option>
          <option value={PostStatus.PUBLISHED}>Published</option>
        </select>
      </div>

      {state.error ? (
        <p className="text-sm text-[var(--danger)]" role="alert">
          {state.error}
        </p>
      ) : null}

      <button type="submit" disabled={pending} className="btn-primary w-fit">
        {pending
          ? "Saving…"
          : mode === "create"
            ? "Create post"
            : "Save changes"}
      </button>
    </form>
  );
}
