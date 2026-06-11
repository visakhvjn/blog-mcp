import type { DiscoverPost } from "@/services/discover-service";
import Link from "next/link";

type DiscoverPostListProps = {
  posts: DiscoverPost[];
  layout?: "list" | "grid";
};

/**
 * Cross-user published post cards with author attribution.
 */
export function DiscoverPostList({
  posts,
  layout = "list",
}: DiscoverPostListProps) {
  if (posts.length === 0) {
    return null;
  }

  const listClassName =
    layout === "grid"
      ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      : "space-y-3";

  return (
    <ul className={listClassName}>
      {posts.map((post) => {
        const date = post.publishedAt ?? post.createdAt;
        const dateLabel = date.toLocaleDateString(undefined, {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
        const authorLabel = post.author.name ?? `@${post.author.username}`;

        return (
          <li key={post.id}>
            <article className="card group flex min-h-[7rem] flex-col p-4 transition hover:border-[var(--accent-soft)] hover:shadow-md">
              <div className="flex items-center justify-between gap-3">
                <Link
                  href={`/${post.author.username}`}
                  className="flex min-w-0 items-center gap-2 text-sm text-secondary transition hover:text-[var(--accent)]"
                >
                  {post.author.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.author.image}
                      alt=""
                      className="h-6 w-6 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--surface-muted)] text-xs font-medium text-muted">
                      {post.author.username.charAt(0).toUpperCase()}
                    </span>
                  )}
                  <span className="truncate">{authorLabel}</span>
                </Link>
                <p className="shrink-0 text-xs text-muted">{dateLabel}</p>
              </div>
              <Link
                href={`/${post.author.username}/${post.slug}`}
                className="mt-3 flex flex-1 flex-col"
              >
                <h3 className="line-clamp-2 text-base font-medium leading-snug text-[var(--text)] group-hover:text-[var(--accent)]">
                  {post.title}
                </h3>
                {post.description ? (
                  <p className="mt-1 line-clamp-2 flex-1 text-sm leading-normal text-secondary">
                    {post.description}
                  </p>
                ) : (
                  <span className="flex-1" />
                )}
              </Link>
            </article>
          </li>
        );
      })}
    </ul>
  );
}
