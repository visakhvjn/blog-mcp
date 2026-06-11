import { DiscoverPostCard } from "@/components/discover-post-card";
import { DiscoverSidebar } from "@/components/discover-sidebar";
import { PublicSiteFooter } from "@/components/site-footer";
import { BRAND_TAGLINE } from "@/lib/brand";
import {
  listDiscoverPostsPaginated,
  listPlatformUsers,
} from "@/services/discover-service";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: BRAND_TAGLINE,
  description: `Discover published posts from builders using ${BRAND_TAGLINE} with their AI assistants.`,
};

type PageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function DiscoverPage({ searchParams }: PageProps) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const pageSize = 10;

  const [{ posts, totalPages }, platformUsers] = await Promise.all([
    listDiscoverPostsPaginated({ page, pageSize }),
    listPlatformUsers(),
  ]);

  const isFirstPage = page === 1;
  const featuredPost = isFirstPage && posts.length > 0 ? posts[0] : null;
  const gridPosts = isFirstPage ? posts.slice(1) : posts;
  const hasPosts = posts.length > 0;
  const showPagination = totalPages > 1;

  return (
    <div className="page-bg">
      <div className="page-shell-discover">
        <div className="discover-layout">
          <main>
            {hasPosts ? (
              <div className="space-y-8">
                {featuredPost ? (
                  <DiscoverPostCard post={featuredPost} variant="featured" />
                ) : null}
                {gridPosts.length > 0 ? (
                  <ul className="grid gap-4 sm:grid-cols-2">
                    {gridPosts.map((post) => (
                      <li key={post.id}>
                        <DiscoverPostCard post={post} variant="grid" />
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ) : (
              <div className="card p-8 text-center">
                <p className="text-secondary">
                  No published posts yet. Be the first to publish.
                </p>
                <Link href="/login" className="btn-primary mt-6 inline-flex">
                  Sign in
                </Link>
              </div>
            )}

            {showPagination ? (
              <nav
                className="mt-10 flex items-center justify-between gap-4 border-t border-[var(--border-subtle)] pt-6"
                aria-label="Pagination"
              >
                {page > 1 ? (
                  <Link
                    href={page === 2 ? "/" : `/?page=${page - 1}`}
                    className="btn-secondary"
                  >
                    Previous
                  </Link>
                ) : (
                  <span />
                )}
                <p className="text-sm text-muted">
                  Page {page} of {totalPages}
                </p>
                {page < totalPages ? (
                  <Link href={`/?page=${page + 1}`} className="btn-secondary">
                    Next
                  </Link>
                ) : (
                  <span />
                )}
              </nav>
            ) : null}

            <PublicSiteFooter />
          </main>

          <DiscoverSidebar users={platformUsers} />
        </div>
      </div>
    </div>
  );
}
