import type { PublicPostSummary } from "@/services/portfolio-service";
import Link from "next/link";

type PublicPostListProps = {
  username: string;
  posts: PublicPostSummary[];
  descriptionClassName?: string;
};

/**
 * Renders uniform published post cards linking to public URLs.
 * Inputs: username, post summaries. Output: list of equal-height cards.
 */
export function PublicPostList({
  username,
  posts,
  descriptionClassName = "text-sm",
}: PublicPostListProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <ul className="space-y-3">
      {posts.map((post) => {
        const date = post.publishedAt ?? post.createdAt;
        const dateLabel = date.toLocaleDateString(undefined, {
          day: "numeric",
          month: "long",
          year: "numeric",
        });

        return (
          <li key={post.id}>
            <Link
              href={`/${username}/${post.slug}`}
              className="card group flex min-h-[5.5rem] flex-col p-4 transition hover:border-[var(--accent-soft)] hover:shadow-md"
            >
              <p className="text-xs text-muted">{dateLabel}</p>
              <h3 className="mt-1 line-clamp-2 text-base font-medium leading-snug text-[var(--text)] group-hover:text-[var(--accent)]">
                {post.title}
              </h3>
              {post.description ? (
                <p
                  className={`mt-1 line-clamp-2 flex-1 leading-normal text-secondary ${descriptionClassName}`}
                >
                  {post.description}
                </p>
              ) : (
                <span className="flex-1" />
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
