import { PublicPostList } from "@/components/public-post-list";
import { PageShell } from "@/components/page-shell";
import { PublicSiteFooter } from "@/components/site-footer";
import {
  getPublicAuthorByUsername,
  getPublicTopicByUsernameAndSlug,
} from "@/services/portfolio-service";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ username: string; topicSlug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { username, topicSlug } = await params;
  const author = await getPublicAuthorByUsername(username);
  if (!author) {
    return { title: "Not found" };
  }
  const topic = await getPublicTopicByUsernameAndSlug(author.id, topicSlug);
  if (!topic) {
    return { title: "Not found" };
  }
  return {
    title: `${topic.name} — ${author.name ?? author.username}`,
    description: topic.description ?? `Posts in ${topic.name}`,
  };
}

export default async function PublicTopicPage({ params }: PageProps) {
  const { username, topicSlug } = await params;
  const author = await getPublicAuthorByUsername(username);
  if (!author) {
    notFound();
  }

  const topic = await getPublicTopicByUsernameAndSlug(author.id, topicSlug);
  if (!topic) {
    notFound();
  }

  return (
    <PageShell wide>
      <Link
        href={`/${author.username}`}
        className="link text-sm"
      >
        ← @{author.username}
      </Link>

      <header className="mb-10 mt-6 border-b border-[var(--border-subtle)] pb-8">
        <p className="text-xs font-medium uppercase tracking-widest text-muted">
          Topic
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--text)]">
          {topic.name}
        </h1>
        {topic.description ? (
          <p className="mt-3 max-w-2xl text-secondary leading-relaxed">
            {topic.description}
          </p>
        ) : null}
      </header>

      <section>
        <div className="mb-8 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-muted)] p-5">
          <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted">
            Post index
          </h2>
          <ol className="list-decimal space-y-1.5 pl-5 text-sm text-[var(--text)]">
            {topic.posts.map((post, index) => (
              <li key={post.id}>
                <Link
                  href={`/${author.username}/${post.slug}`}
                  className="link"
                >
                  {post.title}
                </Link>
              </li>
            ))}
          </ol>
        </div>

        <h2 className="mb-5 text-sm font-medium uppercase tracking-wide text-muted">
          Posts
        </h2>
        <PublicPostList username={author.username} posts={topic.posts} />
      </section>

      <PublicSiteFooter />
    </PageShell>
  );
}
