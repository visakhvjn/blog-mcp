import Link from "next/link";

type McpEditingNoticeProps = {
  /** Which resource this notice is for (posts or topics). */
  resource: "posts" | "topics";
};

const COPY = {
  posts: {
    label: "posts",
    createExample:
      'Create a draft blog post titled "Weekly update" with a short excerpt and markdown body about what I shipped this week.',
    editExample:
      'List my blog posts, then update the post titled "Weekly update" to published and improve the excerpt.',
  },
  topics: {
    label: "topics",
    createExample:
      'Create a topic named "Engineering" with the description "Long-form notes on building software."',
    editExample:
      'List my topics, then assign my latest post to the Engineering topic using update_post.',
  },
} as const;

/**
 * Explains that posts/topics are edited via MCP and shows example Cursor prompts.
 * Inputs: resource type (posts or topics). Output: info card JSX.
 */
export function McpEditingNotice({ resource }: McpEditingNoticeProps) {
  const copy = COPY[resource];

  return (
    <aside className="card-muted mb-6 space-y-3 p-4 text-sm">
      <p className="text-secondary">
        To create or change {copy.label}, use your{" "}
        <strong className="font-medium text-[var(--text)]">MCP client</strong>{" "}
        (e.g. Cursor). This page only lists and deletes—you cannot edit here.{" "}
        <Link href="/dashboard/settings" className="link">
          MCP settings
        </Link>
      </p>
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">
          Example prompts
        </p>
        <p className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs leading-relaxed text-secondary">
          “{copy.createExample}”
        </p>
        <p className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs leading-relaxed text-secondary">
          “{copy.editExample}”
        </p>
      </div>
    </aside>
  );
}
