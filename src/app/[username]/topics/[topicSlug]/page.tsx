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

      <header className="mb-4 mt-6">
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--text)]">
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
            Contents
          </h2>
          <ol className="list-decimal list-outside space-y-1 pl-6 text-sm text-[var(--text)] [&>li]:pl-2">
            {topic.posts.map((post) => (
              <li key={post.id}>
                <Link
                  href={`/${author.username}/${post.slug}`}
                  className="link font-medium"
                >
                  {post.title}
                </Link>
              </li>
            ))}
          </ol>
        </div>

        <PublicPostList
          username={author.username}
          posts={topic.posts}
          descriptionClassName="text-xs"
        />
      </section>

      <PublicSiteFooter />
    </PageShell>
  );
}
