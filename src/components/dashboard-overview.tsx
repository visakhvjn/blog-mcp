type DashboardOverviewProps = {
  postCount: number;
  topicCount: number;
};

/**
 * Overview stat cards and analytics placeholder for the dashboard home.
 * Inputs: post and topic totals. Output: stat grid and placeholder section.
 */
export function DashboardOverview({
  postCount,
  topicCount,
}: DashboardOverviewProps) {
  return (
    <section className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card p-6">
          <p className="text-sm font-medium text-secondary">Total posts</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-[var(--text)]">
            {postCount}
          </p>
        </div>
        <div className="card p-6">
          <p className="text-sm font-medium text-secondary">Total topics</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-[var(--text)]">
            {topicCount}
          </p>
        </div>
      </div>

      <div className="card-muted border-dashed p-10 text-center">
        <p className="text-sm text-secondary">
          Analytics will come up here as it is created
        </p>
      </div>
    </section>
  );
}
