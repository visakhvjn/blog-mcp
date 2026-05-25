import { listPostsByUser } from "@/services/post-service";
import { requireUser } from "@/lib/require-user";
import { DashboardNav } from "@/components/dashboard-nav";
import { SignOutButton } from "@/components/sign-out-button";
import { DeletePostButton } from "@/components/delete-post-button";
import Link from "next/link";
import { PostStatus } from "@prisma/client";

export const metadata = {
  title: "Posts — Blog MCP",
};

/**
 * Lists all posts for the signed-in user with links to edit or create.
 */
export default async function PostsPage() {
  const user = await requireUser();
  const posts = await listPostsByUser(user.id);

  return (
    <div className="mx-auto min-h-screen max-w-3xl px-4 py-12">
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Posts
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            @{user.username}
          </p>
        </div>
        <SignOutButton />
      </header>

      <DashboardNav />

      <div className="mb-6 flex justify-end">
        <Link
          href="/dashboard/posts/new"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
        >
          New post
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="rounded-xl border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500 dark:border-zinc-700">
          No posts yet.{" "}
          <Link
            href="/dashboard/posts/new"
            className="font-medium text-zinc-900 underline dark:text-zinc-200"
          >
            Create your first post
          </Link>
        </p>
      ) : (
        <ul className="divide-y divide-zinc-200 rounded-xl border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
          {posts.map((post) => (
            <li
              key={post.id}
              className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <Link
                  href={`/dashboard/posts/${post.id}/edit`}
                  className="font-medium text-zinc-900 hover:underline dark:text-zinc-50"
                >
                  {post.title}
                </Link>
                <p className="mt-1 font-mono text-xs text-zinc-500">
                  /{post.slug}
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  Updated {post.updatedAt.toLocaleDateString()}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span
                  className={
                    post.status === PostStatus.PUBLISHED
                      ? "rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/40 dark:text-green-300"
                      : "rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                  }
                >
                  {post.status === PostStatus.PUBLISHED ? "Published" : "Draft"}
                </span>
                <Link
                  href={`/dashboard/posts/${post.id}/edit`}
                  className="text-sm text-zinc-600 hover:underline dark:text-zinc-400"
                >
                  Edit
                </Link>
                <DeletePostButton postId={post.id} postTitle={post.title} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
