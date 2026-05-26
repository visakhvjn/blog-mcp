import { Loader } from "@/components/loader";
import { PageShell } from "@/components/page-shell";

/**
 * Centered page loader for route loading.tsx boundaries.
 */
export function PageLoading({
  wide = false,
  centered = false,
}: {
  wide?: boolean;
  centered?: boolean;
}) {
  return (
    <PageShell wide={wide} centered={centered}>
      <div
        className="flex min-h-[40vh] flex-col items-center justify-center gap-3"
        role="status"
        aria-live="polite"
        aria-label="Loading"
      >
        <Loader size="md" className="text-[var(--accent)]" />
        <p className="text-sm text-muted">Loading…</p>
      </div>
    </PageShell>
  );
}
