import { PublicAuthorStatsRow } from "@/components/public-author-stats";
import { PublicPostList } from "@/components/public-post-list";
import { PublicTopicCards } from "@/components/public-topic-cards";
import {
  getPublicAuthorByUsername,
  getPublicAuthorStats,
  listPublicTopicsWithPosts,
  listPublishedPostsForAuthor,
} from "@/services/portfolio-service";
import { PageShell } from "@/components/page-shell";
import { PublicSiteFooter } from "@/components/site-footer";
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
    description:
      author.summary ?? `Published posts by @${author.username}`,
  };
}

export default async function PublicPortfolioPage({ params }: PageProps) {
  const { username } = await params;
  const author = await getPublicAuthorByUsername(username);
  if (!author) {
    notFound();
  }

  const [topics, allPosts, stats] = await Promise.all([
    listPublicTopicsWithPosts(author.id),
    listPublishedPostsForAuthor(author.id),
    getPublicAuthorStats(author.id),
  ]);

  const hasTopics = topics.length > 0;

  return (
    <PageShell wide>
      <header className="mb-10 border-b border-[var(--border-subtle)] pb-8">
        <div className="flex items-center gap-4">
          {author.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={author.image}
              alt=""
              className="h-16 w-16 rounded-full border border-[var(--border)] object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent-soft)] text-xl font-medium text-[var(--accent)]">
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
        {author.summary ? (
          <p className="mt-6 max-w-2xl whitespace-pre-wrap text-sm leading-relaxed text-secondary">
            {author.summary}
          </p>
        ) : null}
        <PublicAuthorStatsRow stats={stats} joinedAt={author.createdAt} />
      </header>

      {allPosts.length === 0 && !hasTopics ? (
        <p className="text-sm text-secondary">No published posts yet.</p>
      ) : (
        <div className="space-y-10">
          {hasTopics ? (
            <section>
              <PublicTopicCards username={author.username} topics={topics} />
            </section>
          ) : null}

          {!hasTopics && allPosts.length > 0 ? (
            <section>
              <h2 className="mb-5 text-sm font-bold uppercase tracking-wide text-muted">
                Posts
              </h2>
              <PublicPostList username={author.username} posts={allPosts} />
            </section>
          ) : null}
        </div>
      )}

      <PublicSiteFooter />
    </PageShell>
  );
}
