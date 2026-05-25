import { PageShell } from "@/components/page-shell";
import Link from "next/link";

export default function PortfolioNotFound() {
  return (
    <PageShell centered>
      <div className="card max-w-md p-8 text-center">
        <h1 className="text-2xl font-semibold text-[var(--text)]">
          Page not found
        </h1>
        <p className="mt-3 text-sm text-secondary">
          This blog or post does not exist, or it is not published yet.
        </p>
        <Link href="/" className="btn-primary mt-6 inline-flex">
          Go home
        </Link>
      </div>
    </PageShell>
  );
}
