import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardNav } from "@/components/dashboard-nav";
import { PageShell } from "@/components/page-shell";
import { requireUser } from "@/lib/require-user";
import Link from "next/link";

export const metadata = {
  title: "Dashboard — Blog MCP",
};

export default async function DashboardPage() {
  const { name, email, username, image } = await requireUser();

  return (
    <PageShell>
      <DashboardHeader
        title="Dashboard"
        subtitle="Your account and public blog"
      />
      <DashboardNav />

      <Link href="/dashboard/posts" className="btn-secondary mb-6 inline-flex">
        Manage posts →
      </Link>

      <section className="card p-6">
        <div className="flex items-center gap-4">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt=""
              className="h-14 w-14 rounded-full border border-[var(--border)] object-cover"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent-soft)] text-lg font-medium text-[var(--accent-hover)]">
              {(name?.[0] ?? email?.[0] ?? "?").toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-medium text-[var(--text)]">{name ?? "User"}</p>
            <p className="text-sm text-secondary">{email}</p>
          </div>
        </div>

        <dl className="mt-6 grid gap-4 border-t border-[var(--border-subtle)] pt-6 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted">
              Username
            </dt>
            <dd className="mt-1 font-mono text-sm text-[var(--text)]">
              @{username}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted">
              Public blog
            </dt>
            <dd className="mt-1">
              <Link
                href={`/${username}`}
                className="link font-mono text-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                /{username}
              </Link>
            </dd>
          </div>
        </dl>
      </section>
    </PageShell>
  );
}
