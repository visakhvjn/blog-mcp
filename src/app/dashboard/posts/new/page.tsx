import { PostForm } from "@/components/post-form";
import { DashboardNav } from "@/components/dashboard-nav";
import { requireUser } from "@/lib/require-user";
import Link from "next/link";

export const metadata = {
  title: "New post — Blog MCP",
};

/**
 * Create post page with markdown form.
 */
export default async function NewPostPage() {
  await requireUser();

  return (
    <div className="mx-auto min-h-screen max-w-3xl px-4 py-12">
      <header className="mb-6">
        <Link
          href="/dashboard/posts"
          className="text-sm text-zinc-600 hover:underline dark:text-zinc-400"
        >
          ← Back to posts
        </Link>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          New post
        </h1>
      </header>

      <DashboardNav />
      <PostForm mode="create" />
    </div>
  );
}
