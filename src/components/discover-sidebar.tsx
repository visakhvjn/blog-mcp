import type { PlatformUser } from "@/services/discover-service";
import { NewsletterSignup } from "@/components/newsletter-signup";
import Link from "next/link";

type DiscoverSidebarProps = {
  users: PlatformUser[];
};

/**
 * Discover sidebar: platform users and weekly newsletter signup.
 */
export function DiscoverSidebar({ users }: DiscoverSidebarProps) {
  return (
    <aside className="discover-sidebar">
      <section className="card p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--text)]">
          Builders on the platform
        </h2>
        {users.length > 0 ? (
          <ul className="mt-4 space-y-3">
            {users.map((user) => {
              const label = user.name ?? `@${user.username}`;
              return (
                <li key={user.username}>
                  <Link
                    href={`/${user.username}`}
                    className="flex items-center gap-3 rounded-lg px-1 py-1 transition hover:bg-[var(--surface-muted)]"
                  >
                    {user.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={user.image}
                        alt=""
                        className="h-9 w-9 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--surface-muted)] text-sm font-medium text-muted">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-[var(--text)]">
                        {label}
                      </span>
                      <span className="block text-xs text-muted">
                        {user.postCount}{" "}
                        {user.postCount === 1 ? "post" : "posts"}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-muted">No published authors yet.</p>
        )}
      </section>

      <section className="card mt-6 p-5">
        <p className="text-sm leading-relaxed text-secondary">
          A weekly newsletter with the best posts and updates from the platform.
        </p>
        <NewsletterSignup />
      </section>
    </aside>
  );
}
