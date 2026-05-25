import { PostForm } from "@/components/post-form";
import { DashboardNav } from "@/components/dashboard-nav";
import { PageShell } from "@/components/page-shell";
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

export default async function EditPostPage({ params }: PageProps) {
  const user = await requireUser();
  const { id } = await params;
  const post = await getPostByIdForUser(id, user.id);

  if (!post) {
    notFound();
  }

  return (
    <PageShell wide>
      <Link href="/dashboard/posts" className="link text-sm">
        ← Back to posts
      </Link>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight text-[var(--text)]">
        Edit post
      </h1>
      <div className="mt-6">
        <DashboardNav />
      </div>
      <div className="mt-2">
        <PostForm mode="edit" post={post} />
      </div>
    </PageShell>
  );
}
