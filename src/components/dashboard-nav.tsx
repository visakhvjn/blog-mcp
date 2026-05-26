"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Overview", exact: true },
  { href: "/dashboard/posts", label: "Posts", exact: false },
  { href: "/dashboard/topics", label: "Topics", exact: false },
  { href: "/dashboard/profile", label: "Profile", exact: false },
  { href: "/dashboard/settings", label: "AI Publisher", exact: false },
];

/**
 * Pill-style dashboard navigation with active state.
 */
export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="mb-8 flex flex-wrap gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-muted)] p-1.5">
      {links.map(({ href, label, exact }) => {
        const active = exact
          ? pathname === href
          : pathname === href || pathname.startsWith(`${href}/`);

        return (
          <Link
            key={href}
            href={href}
            className={
              active
                ? "rounded-lg bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--text)] shadow-sm"
                : "rounded-lg px-4 py-2 text-sm font-medium text-[var(--text-secondary)] transition hover:text-[var(--text)]"
            }
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
