import {
  getPublicAuthorByUsername,
  listPublishedPostsForAuthor,
} from "@/services/portfolio-service";
import { PageShell } from "@/components/page-shell";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ username: string }>;
};

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
    <PageShell wide>
      <header className="mb-10 border-b border-[var(--border-subtle)] pb-8">
        <p className="text-xs font-medium uppercase tracking-widest text-muted">
          Blog
        </p>
        <div className="mt-4 flex items-center gap-4">
          {author.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={author.image}
              alt=""
              className="h-16 w-16 rounded-full border border-[var(--border)] object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent-soft)] text-xl font-medium text-[var(--accent-hover)]">
              {(author.name?.[0] ?? author.username[0]).toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-[var(--text)]">
              {author.name ?? author.username}
            </h1>
            <p className="mt-1 font-mono text-sm text-[var(--accent)]">
              @{author.username}
            </p>
          </div>
        </div>
      </header>

      <section>
        <h2 className="mb-5 text-sm font-medium uppercase tracking-wide text-muted">
          Published posts
        </h2>
        {posts.length === 0 ? (
          <p className="text-sm text-secondary">No published posts yet.</p>
        ) : (
          <ul className="space-y-4">
            {posts.map((post) => (
              <li key={post.id}>
                <Link
                  href={`/${author.username}/${post.slug}`}
                  className="card block p-5 transition hover:shadow-md"
                >
                  <h3 className="text-xl font-medium text-[var(--text)]">
                    {post.title}
                  </h3>
                  {post.excerpt ? (
                    <p className="mt-2 text-sm leading-relaxed text-secondary">
                      {post.excerpt}
                    </p>
                  ) : null}
                  <p className="mt-3 text-xs text-muted">
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

      <footer className="mt-16 text-center text-sm text-muted">
        <Link href="/" className="link">
          Blog MCP
        </Link>
      </footer>
    </PageShell>
  );
}
