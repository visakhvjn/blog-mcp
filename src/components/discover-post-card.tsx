import type { DiscoverPost } from "@/services/discover-service";
import Link from "next/link";

type DiscoverPostCardProps = {
  post: DiscoverPost;
  variant?: "featured" | "grid";
};

function formatDate(post: DiscoverPost) {
  const date = post.publishedAt ?? post.createdAt;
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function AuthorLink({ post }: { post: DiscoverPost }) {
  const authorLabel = post.author.name ?? `@${post.author.username}`;

  return (
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
  );
}

/**
 * Single discover post card — featured (hero) or compact grid variant.
 */
export function DiscoverPostCard({
  post,
  variant = "grid",
}: DiscoverPostCardProps) {
  const dateLabel = formatDate(post);
  const postHref = `/${post.author.username}/${post.slug}`;

  if (variant === "featured") {
    return (
      <article className="card group overflow-hidden transition hover:border-[var(--accent-soft)] hover:shadow-md">
        <Link href={postHref} className="block p-6 sm:p-8">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--accent)]">
            Featured
          </p>
          <h2 className="mt-3 text-2xl font-semibold leading-tight tracking-tight text-[var(--text)] transition group-hover:text-[var(--accent)] sm:text-3xl">
            {post.title}
          </h2>
          {post.description ? (
            <p className="mt-4 line-clamp-3 text-base leading-relaxed text-secondary">
              {post.description}
            </p>
          ) : null}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-subtle)] pt-4">
            <AuthorLink post={post} />
            <p className="text-xs text-muted">{dateLabel}</p>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className="card group flex h-full min-h-[10rem] flex-col p-4 transition hover:border-[var(--accent-soft)] hover:shadow-md">
      <div className="flex items-center justify-between gap-3">
        <AuthorLink post={post} />
        <p className="shrink-0 text-xs text-muted">{dateLabel}</p>
      </div>
      <Link href={postHref} className="mt-3 flex flex-1 flex-col">
        <h3 className="line-clamp-2 text-base font-medium leading-snug text-[var(--text)] group-hover:text-[var(--accent)]">
          {post.title}
        </h3>
        {post.description ? (
          <p className="mt-1 line-clamp-3 flex-1 text-sm leading-normal text-secondary">
            {post.description}
          </p>
        ) : (
          <span className="flex-1" />
        )}
      </Link>
    </article>
  );
}
