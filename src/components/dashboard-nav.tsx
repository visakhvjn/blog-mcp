import Link from "next/link";

/**
 * Secondary navigation for authenticated dashboard sections.
 * Inputs: none. Output: nav links.
 */
export function DashboardNav() {
  return (
    <nav className="mb-8 flex gap-4 border-b border-zinc-200 pb-4 text-sm dark:border-zinc-800">
      <Link
        href="/dashboard"
        className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
      >
        Overview
      </Link>
      <Link
        href="/dashboard/posts"
        className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
      >
        Posts
      </Link>
      <Link
        href="/dashboard/settings"
        className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
      >
        MCP
      </Link>
    </nav>
  );
}
