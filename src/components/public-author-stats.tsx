import type { PublicAuthorStats } from "@/services/portfolio-service";

type PublicAuthorStatsProps = {
  stats: PublicAuthorStats;
  joinedAt: Date;
};

/**
 * Renders topic count, post count, and joined date below the profile summary.
 * Inputs: stats and user createdAt. Output: inline stat row.
 */
export function PublicAuthorStatsRow({
  stats,
  joinedAt,
}: PublicAuthorStatsProps) {
  const joinedLabel = joinedAt.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  const items = [
    `${stats.topicCount} ${stats.topicCount === 1 ? "topic" : "topics"}`,
    `${stats.postCount} ${stats.postCount === 1 ? "post" : "posts"}`,
    `Joined ${joinedLabel}`,
  ];

  return (
    <p className="mt-4 text-sm text-muted">{items.join(" · ")}</p>
  );
}
