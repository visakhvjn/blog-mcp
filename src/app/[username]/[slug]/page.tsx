import { MarkdownContent } from "@/components/markdown-content";
import { PageShell } from "@/components/page-shell";
import { PublicSiteFooter } from "@/components/site-footer";
import { extractMarkdownHeadings } from "@/lib/markdown-headings";
import {
  getPublishedPostByUsernameAndSlug,
  getTopicAdjacentPostsForPublishedPost,
} from "@/services/portfolio-service";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ username: string; slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { username, slug } = await params;
  const result = await getPublishedPostByUsernameAndSlug(username, slug);
  if (!result) {
    return { title: "Not found" };
  }
  return {
    title: `${result.post.title} — ${result.author.name ?? result.author.username}`,
    description: result.post.excerpt ?? undefined,
  };
}

export default async function PublicPostPage({ params }: PageProps) {
  const { username, slug } = await params;
  const result = await getPublishedPostByUsernameAndSlug(username, slug);
  if (!result) {
    notFound();
  }

  const { author, post } = result;
  const adjacent = await getTopicAdjacentPostsForPublishedPost(author.id, post.id);
  const headings = extractMarkdownHeadings(post.content).filter(
    (heading) => heading.level >= 2 && heading.level <= 4,
  );
  const publishedLabel = post.publishedAt
    ? post.publishedAt.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <PageShell containerClassName="mx-auto w-full px-5 py-10 sm:px-6">
      <aside className="fixed left-4 top-24 hidden w-60 xl:block">
        {headings.length > 0 ? (
          <div className="max-h-[calc(100vh-7rem)] overflow-y-auto rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-muted)] p-4">
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted">
                On this page
              </p>
              <ul className="space-y-2">
                {headings.map((heading) => (
                  <li
                    key={heading.id}
                    className={heading.level === 2 ? "" : heading.level === 3 ? "pl-3" : "pl-6"}
                  >
                    <a
                      href={`#${heading.id}`}
                      className="text-sm text-secondary transition hover:text-[var(--text)]"
                    >
                      {heading.text}
                    </a>
                  </li>
                ))}
              </ul>
          </div>
        ) : null}
      </aside>

      <div className="mx-auto w-full max-w-3xl">
        <article className="min-w-0">
          <nav className="mb-8">
            <Link href={`/${author.username}`} className="link text-sm">
              ← @{author.username}
            </Link>
          </nav>
          <header className="mb-10 border-b border-[var(--border)] pb-8">
            {adjacent?.previous ? (
              <div className="mb-5">
                <p className="mb-1 text-xs uppercase tracking-wide text-muted">Previous in {adjacent.topic.name}</p>
                <Link
                  href={`/${author.username}/${adjacent.previous.slug}`}
                  className="link text-sm"
                >
                  ← {adjacent.previous.title}
                </Link>
              </div>
            ) : null}
            <h1 className="text-3xl font-semibold leading-tight tracking-tight text-[var(--text)] sm:text-4xl">
              {post.title}
            </h1>
            {post.excerpt ? (
              <p className="mt-4 text-lg leading-relaxed text-secondary">
                {post.excerpt}
              </p>
            ) : null}
            {publishedLabel ? (
              <p className="mt-4 text-sm text-muted">{publishedLabel}</p>
            ) : null}
          </header>

          <MarkdownContent content={post.content} />

          {adjacent?.next ? (
            <footer className="mt-12 border-t border-[var(--border)] pt-6">
              <p className="mb-1 text-xs uppercase tracking-wide text-muted">Next in {adjacent.topic.name}</p>
              <Link
                href={`/${author.username}/${adjacent.next.slug}`}
                className="link text-sm"
              >
                {adjacent.next.title} →
              </Link>
            </footer>
          ) : null}
        </article>
        <PublicSiteFooter className="mt-12 text-center text-sm text-muted">
          <Link href={`/${author.username}`} className="link">
            More from {author.name ?? author.username}
          </Link>
        </PublicSiteFooter>
      </div>
    </PageShell>
  );
}
