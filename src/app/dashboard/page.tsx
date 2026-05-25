import { SignOutButton } from "@/components/sign-out-button";
import { DashboardNav } from "@/components/dashboard-nav";
import { requireUser } from "@/lib/require-user";
import Link from "next/link";

export const metadata = {
  title: "Dashboard — Blog MCP",
};

/**
 * Authenticated dashboard: welcome message, username, and sign out.
 */
export default async function DashboardPage() {
  const { name, email, username, image } = await requireUser();

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col px-4 py-12">
      <header className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            You are signed in.
          </p>
        </div>
        <SignOutButton />
      </header>

      <DashboardNav />

      <Link
        href="/dashboard/posts"
        className="mb-6 inline-flex rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
      >
        Manage posts →
      </Link>

      <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center gap-4">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt=""
              className="h-14 w-14 rounded-full border border-zinc-200 dark:border-zinc-700"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-200 text-lg font-medium text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
              {(name?.[0] ?? email?.[0] ?? "?").toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-medium text-zinc-900 dark:text-zinc-50">
              {name ?? "User"}
            </p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">{email}</p>
          </div>
        </div>

        <dl className="mt-6 space-y-3 border-t border-zinc-100 pt-6 dark:border-zinc-800">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Username
            </dt>
            <dd className="mt-1 font-mono text-sm text-zinc-900 dark:text-zinc-100">
              @{username}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Public blog
            </dt>
            <dd className="mt-1">
              <Link
                href={`/${username}`}
                className="text-sm font-medium text-zinc-900 underline dark:text-zinc-100"
                target="_blank"
                rel="noopener noreferrer"
              >
                /{username}
              </Link>
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
