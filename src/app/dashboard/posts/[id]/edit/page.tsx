import { PostForm } from "@/components/post-form";
import { DashboardNav } from "@/components/dashboard-nav";
import { requireUser } from "@/lib/require-user";
import { getPostByIdForUser } from "@/services/post-service";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const metadata = {
  title: "Edit post — Blog MCP",
};

/**
 * Edit post page for a post owned by the signed-in user.
 */
export default async function EditPostPage({ params }: PageProps) {
  const user = await requireUser();
  const { id } = await params;
  const post = await getPostByIdForUser(id, user.id);

  if (!post) {
    notFound();
  }

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
          Edit post
        </h1>
      </header>

      <DashboardNav />
      <PostForm mode="edit" post={post} />
    </div>
  );
}
