import Link from "next/link";

type SiteHeaderProps = {
  isAuthenticated: boolean;
  dashboardHref: string;
};

/**
 * Marketing site header with nav and auth CTA.
 */
export function SiteHeader({
  isAuthenticated,
  dashboardHref,
}: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--surface)]/92 backdrop-blur-md">
      <div className="marketing-container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold text-[var(--text)]">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-sm text-[var(--accent-hover)]">
            B
          </span>
          Blog MCP
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-secondary sm:flex">
          <a href="#features" className="transition hover:text-[var(--text)]">
            Features
          </a>
          <a href="#how-it-works" className="transition hover:text-[var(--text)]">
            How it works
          </a>
          <a href="#pricing" className="transition hover:text-[var(--text)]">
            Pricing
          </a>
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Link href={dashboardHref} className="btn-primary">
              Dashboard
            </Link>
          ) : (
            <Link href="/login" className="btn-primary">
              Start free
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
