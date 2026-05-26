import type { ReactNode } from "react";
import Link from "next/link";

const PORTFOLIO_URL = "https://www.visakhvijayan.com/";

export function BuiltByAttribution() {
  return (
    <span>
      Built by{" "}
      <a
        href={PORTFOLIO_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="link"
      >
        Visakh Vijayan
      </a>
    </span>
  );
}

type PublicSiteFooterProps = {
  children?: ReactNode;
  className?: string;
};

export function PublicSiteFooter({
  children,
  className = "mt-16 text-center text-sm text-muted",
}: PublicSiteFooterProps) {
  return (
    <footer className={className}>
      {children}
      <p className={children ? "mt-2" : undefined}>
        <Link href="/" className="link">
          Blog MCP
        </Link>
        {" · "}
        <BuiltByAttribution />
      </p>
    </footer>
  );
}
