import { PostForm } from "@/components/post-form";
import { DashboardNav } from "@/components/dashboard-nav";
import { PageShell } from "@/components/page-shell";
import { requireUser } from "@/lib/require-user";
import Link from "next/link";

export const metadata = {
  title: "New post — Blog MCP",
};

export default async function NewPostPage() {
  await requireUser();

  return (
    <PageShell wide>
      <Link href="/dashboard/posts" className="link text-sm">
        ← Back to posts
      </Link>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight text-[var(--text)]">
        New post
      </h1>
      <div className="mt-6">
        <DashboardNav />
      </div>
      <div className="mt-2">
        <PostForm mode="create" />
      </div>
    </PageShell>
  );
}
