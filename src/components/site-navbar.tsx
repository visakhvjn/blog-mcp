import type { AppSession } from "@/lib/app-session";
import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/brand";
import { SignInButton } from "@/components/sign-in-button";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";

type SiteNavbarProps = {
  session: AppSession | null;
};

/**
 * Site-wide top navigation with brand, marketing links, and auth actions.
 */
export async function SiteNavbar({ session }: SiteNavbarProps) {
  const isAuthenticated = Boolean(session?.user);
  const dashboardHref = session?.user?.username ? "/dashboard" : "/onboarding";

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--surface)]/92 backdrop-blur-md">
      <div className="marketing-container flex h-14 items-center justify-between gap-4">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 text-[var(--text)]"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-xs font-semibold text-[var(--accent)]">
            d!
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-semibold sm:text-base">{BRAND_NAME}</span>
            <span className="hidden text-xs font-normal text-muted sm:block">
              {BRAND_TAGLINE}
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-6">
          <nav className="flex items-center gap-4 text-sm font-medium text-secondary sm:gap-8">
            <Link href="/" className="transition hover:text-[var(--text)]">
              Discover
            </Link>
            <Link href="/about" className="transition hover:text-[var(--text)]">
              About
            </Link>
          </nav>

          <div className="hidden shrink-0 items-center gap-2 text-sm sm:flex sm:gap-3">
            <ThemeToggle />
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

          <div className="sm:hidden">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
