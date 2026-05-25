import type { PublicTopicWithPosts } from "@/services/portfolio-service";
import Link from "next/link";

type PublicTopicCardsProps = {
  username: string;
  topics: PublicTopicWithPosts[];
};

/**
 * Horizontally scrollable compact topic cards for a public portfolio.
 * Inputs: username, topics with posts. Output: scroll row JSX.
 */
export function PublicTopicCards({ username, topics }: PublicTopicCardsProps) {
  if (topics.length === 0) {
    return null;
  }

  return (
    <div className="-mx-5 overflow-x-auto px-5 pb-1 scroll-smooth sm:-mx-6 sm:px-6">
      <ul className="flex w-max gap-3 pr-4">
        {topics.map((topic) => {
          const postCount = topic.posts.length;

          return (
            <li
              key={topic.id}
              className="w-[min(64vw,12.5rem)] shrink-0 sm:w-48"
            >
              <Link
                href={`/${username}/topics/${topic.slug}`}
                className="card group flex min-h-[5rem] flex-col p-4 transition hover:border-[var(--accent-soft)] hover:shadow-md"
              >
                <h3 className="line-clamp-2 text-base font-semibold leading-snug tracking-tight text-[var(--text)] group-hover:text-[var(--accent)]">
                  {topic.name}
                </h3>
                {topic.description ? (
                  <p className="mt-1 line-clamp-2 text-xs leading-normal text-secondary">
                    {topic.description}
                  </p>
                ) : null}
                <p className="mt-auto pt-2 text-xs font-medium text-[var(--accent)]">
                  {postCount} post{postCount === 1 ? "" : "s"}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
