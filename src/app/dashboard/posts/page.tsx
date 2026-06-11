import { listPostsByUser } from "@/services/post-service";
import { BRAND_NAME } from "@/lib/brand";
import { requireUser } from "@/lib/require-user";
import { DashboardNav } from "@/components/dashboard-nav";
import { DashboardHeader } from "@/components/dashboard-header";
import { PageShell } from "@/components/page-shell";
import { DeletePostButton } from "@/components/delete-post-button";
import { McpEditingNotice } from "@/components/mcp-editing-notice";
import Link from "next/link";
import { PostStatus } from "@prisma/client";

export const metadata = {
  title: `Posts — ${BRAND_NAME}`,
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

      <McpEditingNotice resource="posts" />

      {posts.length === 0 ? (
        <div className="card-muted border-dashed p-10 text-center">
          <p className="text-sm text-secondary">No posts yet.</p>
          <p className="mt-2 text-sm text-muted">
            Create posts from Cursor or any MCP client.{" "}
            <Link href="/dashboard/settings" className="link">
              MCP settings
            </Link>
          </p>
        </div>
      ) : (
        <ul className="card divide-y divide-[var(--border-subtle)] overflow-hidden">
          {posts.map((post) => {
            const displayDate = post.publishedAt ?? post.updatedAt;
            const dateLabel = displayDate.toLocaleDateString(undefined, {
              day: "numeric",
              month: "long",
              year: "numeric",
            });

            return (
            <li
              key={post.id}
              className="flex flex-col gap-3 p-5 transition hover:bg-[var(--bg-elevated)] sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted">
                  {dateLabel}
                  {post.topicName ? (
                    <>
                      <span className="mx-2 text-[var(--border)]">·</span>
                      <span className="font-medium text-[var(--accent)]">
                        {post.topicName}
                      </span>
                    </>
                  ) : null}
                </p>
                <p className="mt-2 font-medium text-[var(--text)]">
                  {post.title}
                </p>
                {post.excerpt ? (
                  <p className="mt-1 line-clamp-2 text-sm leading-snug text-secondary">
                    {post.excerpt}
                  </p>
                ) : null}
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
                <DeletePostButton postId={post.id} postTitle={post.title} />
              </div>
            </li>
            );
          })}
        </ul>
      )}
    </PageShell>
  );
}
