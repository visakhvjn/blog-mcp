import { MarkdownContent } from "@/components/markdown-content";
import { getPublishedPostByUsernameAndSlug } from "@/services/portfolio-service";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ username: string; slug: string }>;
};

/**
 * Public single post page (published only).
 */
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
  const publishedLabel = post.publishedAt
    ? post.publishedAt.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="mx-auto min-h-screen max-w-2xl px-4 py-12">
      <nav className="mb-8 text-sm text-zinc-500">
        <Link href={`/${author.username}`} className="hover:underline">
          ← @{author.username}
        </Link>
      </nav>

      <article>
        <header className="mb-8 border-b border-zinc-200 pb-8 dark:border-zinc-800">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {post.title}
          </h1>
          {post.excerpt ? (
            <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-400">
              {post.excerpt}
            </p>
          ) : null}
          {publishedLabel ? (
            <p className="mt-4 text-sm text-zinc-500">{publishedLabel}</p>
          ) : null}
        </header>

        <MarkdownContent content={post.content} />
      </article>

      <footer className="mt-16 border-t border-zinc-200 pt-8 text-center text-sm text-zinc-500 dark:border-zinc-800">
        <Link href={`/${author.username}`} className="hover:underline">
          More from {author.name ?? author.username}
        </Link>
      </footer>
    </div>
  );
}
