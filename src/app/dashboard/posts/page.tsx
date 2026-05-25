import { listPostsByUser } from "@/services/post-service";
import { requireUser } from "@/lib/require-user";
import { DashboardNav } from "@/components/dashboard-nav";
import { DashboardHeader } from "@/components/dashboard-header";
import { PageShell } from "@/components/page-shell";
import { DeletePostButton } from "@/components/delete-post-button";
import Link from "next/link";
import { PostStatus } from "@prisma/client";

export const metadata = {
  title: "Posts — Blog MCP",
};

export default async function PostsPage() {
  const user = await requireUser();
  const posts = await listPostsByUser(user.id);

  return (
    <PageShell wide>
      <DashboardHeader
        title="Posts"
        subtitle={
          <>
            @{user.username} ·{" "}
            <Link
              href={`/${user.username}`}
              className="link"
              target="_blank"
              rel="noopener noreferrer"
            >
              View public blog
            </Link>
          </>
        }
      />
      <DashboardNav />

      <div className="mb-6 flex justify-end">
        <Link href="/dashboard/posts/new" className="btn-primary">
          New post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="card-muted border-dashed p-10 text-center">
          <p className="text-sm text-secondary">No posts yet.</p>
          <Link href="/dashboard/posts/new" className="link mt-2 inline-block text-sm">
            Create your first post
          </Link>
        </div>
      ) : (
        <ul className="card divide-y divide-[var(--border-subtle)] overflow-hidden">
          {posts.map((post) => (
            <li
              key={post.id}
              className="flex flex-col gap-3 p-5 transition hover:bg-[var(--bg-elevated)] sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <Link
                  href={`/dashboard/posts/${post.id}/edit`}
                  className="font-medium text-[var(--text)] hover:text-[var(--accent)]"
                >
                  {post.title}
                </Link>
                <p className="mt-1 font-mono text-xs text-muted">/{post.slug}</p>
                <p className="mt-1 text-xs text-muted">
                  Updated {post.updatedAt.toLocaleDateString()}
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap items-center gap-3">
                <span
                  className={
                    post.status === PostStatus.PUBLISHED
                      ? "badge-published"
                      : "badge-draft"
                  }
                >
                  {post.status === PostStatus.PUBLISHED ? "Published" : "Draft"}
                </span>
                {post.status === PostStatus.PUBLISHED ? (
                  <Link
                    href={`/${user.username}/${post.slug}`}
                    className="text-sm font-medium text-[var(--accent)] hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View
                  </Link>
                ) : null}
                <Link
                  href={`/dashboard/posts/${post.id}/edit`}
                  className="text-sm font-medium text-secondary hover:text-[var(--text)]"
                >
                  Edit
                </Link>
                <DeletePostButton postId={post.id} postTitle={post.title} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}
