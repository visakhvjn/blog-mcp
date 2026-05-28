import { MarkdownContent } from "@/components/markdown-content";
import { PageShell } from "@/components/page-shell";
import { PublicSiteFooter } from "@/components/site-footer";
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
  const publishedLabel = post.publishedAt
    ? post.publishedAt.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <PageShell wide>
      <nav className="mb-8">
        <Link href={`/${author.username}`} className="link text-sm">
          ← @{author.username}
        </Link>
      </nav>

      <article>
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
    </PageShell>
  );
}
