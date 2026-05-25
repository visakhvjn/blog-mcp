import { listTopicsByUser } from "@/services/topic-service";
import { requireUser } from "@/lib/require-user";
import { DashboardNav } from "@/components/dashboard-nav";
import { DashboardHeader } from "@/components/dashboard-header";
import { PageShell } from "@/components/page-shell";
import { DeleteTopicButton } from "@/components/delete-topic-button";
import { McpEditingNotice } from "@/components/mcp-editing-notice";
import Link from "next/link";

export const metadata = {
  title: "Topics — Blog MCP",
};

export default async function TopicsPage() {
  const user = await requireUser();
  const topics = await listTopicsByUser(user.id);

  return (
    <PageShell wide>
      <DashboardHeader
        title="Topics"
        subtitle={
          <>
            Group related posts ·{" "}
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

      <McpEditingNotice resource="topics" />

      {topics.length === 0 ? (
        <div className="card-muted border-dashed p-10 text-center">
          <p className="text-sm text-secondary">No topics yet.</p>
          <p className="mt-2 text-sm text-muted">
            Create topics from Cursor or any MCP client.{" "}
            <Link href="/dashboard/settings" className="link">
              MCP settings
            </Link>
          </p>
        </div>
      ) : (
        <ul className="card divide-y divide-[var(--border-subtle)] overflow-hidden">
          {topics.map((topic) => {
            const dateLabel = topic.createdAt.toLocaleDateString(undefined, {
              day: "numeric",
              month: "long",
              year: "numeric",
            });
            const postLabel = `${topic.postCount} post${topic.postCount === 1 ? "" : "s"}`;

            return (
              <li
                key={topic.id}
                className="flex flex-col gap-3 p-5 transition hover:bg-[var(--bg-elevated)] sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted">
                    {dateLabel}
                    <span className="mx-2 text-[var(--border)]">·</span>
                    {postLabel}
                  </p>
                  <p className="mt-2 font-medium text-[var(--text)]">
                    {topic.name}
                  </p>
                  {topic.description ? (
                    <p className="mt-1 line-clamp-2 text-sm leading-snug text-secondary">
                      {topic.description}
                    </p>
                  ) : null}
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-3">
                  {topic.postCount > 0 && user.username ? (
                    <Link
                      href={`/${user.username}/topics/${topic.slug}`}
                      className="text-sm font-medium text-[var(--accent)] hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View
                    </Link>
                  ) : null}
                  <DeleteTopicButton
                    topicId={topic.id}
                    topicName={topic.name}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </PageShell>
  );
}
