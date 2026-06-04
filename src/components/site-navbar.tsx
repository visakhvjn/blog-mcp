import { getAppSession } from "@/lib/app-session";
import { SignInButton } from "@/components/sign-in-button";
import Link from "next/link";

/**
 * Site-wide top navigation with brand, marketing links, and auth actions.
 */
export async function SiteNavbar() {
  const session = await getAppSession();
  const isAuthenticated = Boolean(session?.user);
  const dashboardHref = session?.user?.username ? "/dashboard" : "/onboarding";
  const publicBlogHref = session?.user?.username
    ? `/${session.user.username}`
    : null;

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--surface)]/92 backdrop-blur-md">
      <div className="marketing-container flex h-14 items-center justify-between gap-4">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 font-semibold text-[var(--text)]"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-sm font-semibold text-[var(--accent)]">
            B
          </span>
          Blog MCP
        </Link>

        <div className="flex items-center gap-6 sm:gap-8">
          <nav className="hidden items-center gap-8 text-sm font-medium text-secondary md:flex">
            <Link href="/#features" className="transition hover:text-[var(--text)]">
              Features
            </Link>
            <Link href="/#how-it-works" className="transition hover:text-[var(--text)]">
              How it works
            </Link>
            <Link href="/#pricing" className="transition hover:text-[var(--text)]">
              Pricing
            </Link>
          </nav>

          <div className="flex shrink-0 items-center gap-3 text-sm">
            {publicBlogHref ? (
              <Link href={publicBlogHref} className="link hidden sm:inline">
                My blog
              </Link>
            ) : null}
            {isAuthenticated ? (
              <Link href={dashboardHref} className="btn-primary px-3 py-1.5">
                Dashboard
              </Link>
            ) : (
              <SignInButton
                returnTo="/dashboard"
                className="btn-primary px-3 py-1.5"
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
