import {
  getPublicAuthorByUsername,
  listPublishedPostsForAuthor,
} from "@/services/portfolio-service";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ username: string }>;
};

/**
 * Public portfolio: author profile and list of published posts.
 */
export async function generateMetadata({ params }: PageProps) {
  const { username } = await params;
  const author = await getPublicAuthorByUsername(username);
  if (!author) {
    return { title: "Not found" };
  }
  return {
    title: `${author.name ?? author.username} — Blog`,
    description: `Published posts by @${author.username}`,
  };
}

export default async function PublicPortfolioPage({ params }: PageProps) {
  const { username } = await params;
  const author = await getPublicAuthorByUsername(username);
  if (!author) {
    notFound();
  }

  const posts = await listPublishedPostsForAuthor(author.id);

  return (
    <div className="mx-auto min-h-screen max-w-2xl px-4 py-12">
      <header className="mb-10 border-b border-zinc-200 pb-8 dark:border-zinc-800">
        <p className="text-sm text-zinc-500">Blog</p>
        <div className="mt-4 flex items-center gap-4">
          {author.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={author.image}
              alt=""
              className="h-16 w-16 rounded-full border border-zinc-200 dark:border-zinc-700"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-200 text-xl font-medium text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
              {(author.name?.[0] ?? author.username[0]).toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              {author.name ?? author.username}
            </h1>
            <p className="mt-1 font-mono text-sm text-zinc-500">
              @{author.username}
            </p>
          </div>
        </div>
      </header>

      <section>
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-zinc-500">
          Published posts
        </h2>
        {posts.length === 0 ? (
          <p className="text-sm text-zinc-500">No published posts yet.</p>
        ) : (
          <ul className="space-y-6">
            {posts.map((post) => (
              <li key={post.id}>
                <Link
                  href={`/${author.username}/${post.slug}`}
                  className="group block"
                >
                  <h3 className="text-xl font-medium text-zinc-900 group-hover:underline dark:text-zinc-50">
                    {post.title}
                  </h3>
                  {post.excerpt ? (
                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                      {post.excerpt}
                    </p>
                  ) : null}
                  <p className="mt-2 text-xs text-zinc-500">
                    {post.publishedAt
                      ? post.publishedAt.toLocaleDateString()
                      : post.createdAt.toLocaleDateString()}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <footer className="mt-16 text-center text-sm text-zinc-500">
        <Link href="/" className="hover:underline">
          Blog MCP
        </Link>
      </footer>
    </div>
  );
}
