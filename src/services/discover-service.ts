import { getPostDescription } from "@/lib/post-description";
import { isReservedUsername } from "@/lib/reserved-usernames";
import { prisma } from "@/lib/prisma";
import { PostStatus } from "@prisma/client";

export type DiscoverPost = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  publishedAt: Date | null;
  createdAt: Date;
  author: {
    username: string;
    name: string | null;
    image: string | null;
  };
};

export type DiscoverPostsPage = {
  posts: DiscoverPost[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type PlatformUser = {
  username: string;
  name: string | null;
  image: string | null;
  postCount: number;
};

const discoverPostSelect = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  content: true,
  publishedAt: true,
  createdAt: true,
  user: {
    select: {
      username: true,
      name: true,
      image: true,
    },
  },
} as const;

type DiscoverPostRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  publishedAt: Date | null;
  createdAt: Date;
  user: {
    username: string | null;
    name: string | null;
    image: string | null;
  };
};

function toDiscoverPost(post: DiscoverPostRow): DiscoverPost | null {
  const username = post.user.username;
  if (!username || isReservedUsername(username)) {
    return null;
  }

  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    description: getPostDescription(post.excerpt, post.content),
    publishedAt: post.publishedAt,
    createdAt: post.createdAt,
    author: {
      username,
      name: post.user.name,
      image: post.user.image,
    },
  };
}

/**
 * Lists published posts across all users for the Discover feed.
 */
export async function listDiscoverPostsPaginated(options: {
  page: number;
  pageSize: number;
}): Promise<DiscoverPostsPage> {
  const page = Math.max(1, options.page);
  const pageSize = Math.min(Math.max(1, options.pageSize), 50);

  const where = {
    status: PostStatus.PUBLISHED,
    user: { username: { not: null } },
  };

  const [rows, total] = await Promise.all([
    prisma.post.findMany({
      where,
      select: discoverPostSelect,
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.post.count({ where }),
  ]);

  const posts = rows
    .map((row) => toDiscoverPost(row))
    .filter((post): post is DiscoverPost => post !== null);

  return {
    posts,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

/**
 * Lists users with at least one published post for the Discover sidebar.
 */
export async function listPlatformUsers(): Promise<PlatformUser[]> {
  const rows = await prisma.user.findMany({
    where: {
      username: { not: null },
      posts: { some: { status: PostStatus.PUBLISHED } },
    },
    select: {
      username: true,
      name: true,
      image: true,
      _count: {
        select: {
          posts: { where: { status: PostStatus.PUBLISHED } },
        },
      },
    },
    orderBy: { username: "asc" },
  });

  return rows
    .filter((row) => row.username && !isReservedUsername(row.username))
    .map((row) => ({
      username: row.username as string,
      name: row.name,
      image: row.image,
      postCount: row._count.posts,
    }));
}
