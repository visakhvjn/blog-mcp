import { isReservedUsername } from "@/lib/reserved-usernames";
import { prisma } from "@/lib/prisma";
import { PostStatus } from "@prisma/client";

export type PublicAuthor = {
  id: string;
  username: string;
  name: string | null;
  image: string | null;
  summary: string | null;
  createdAt: Date;
};

export type PublicAuthorStats = {
  topicCount: number;
  postCount: number;
};

export type PublicPostSummary = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  publishedAt: Date | null;
  createdAt: Date;
};

export type TopicAdjacentPosts = {
  topic: {
    name: string;
    slug: string;
  };
  previous: PublicPostSummary | null;
  next: PublicPostSummary | null;
};

export type PublicTopicWithPosts = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  posts: PublicPostSummary[];
};

/**
 * Loads a user by public username for portfolio pages.
 * Inputs: username from URL. Output: author or null if missing / reserved.
 */
export async function getPublicAuthorByUsername(
  username: string,
): Promise<PublicAuthor | null> {
  if (isReservedUsername(username)) {
    return null;
  }

  const user = await prisma.user.findFirst({
    where: { username: username.toLowerCase() },
    select: {
      id: true,
      username: true,
      name: true,
      image: true,
      summary: true,
      createdAt: true,
    },
  });

  if (!user?.username) {
    return null;
  }

  return user as PublicAuthor;
}

/**
 * Counts public-facing topics and published posts for a profile.
 * Topics are those with at least one published post.
 * Inputs: userId. Output: topic and post counts.
 */
export async function getPublicAuthorStats(
  userId: string,
): Promise<PublicAuthorStats> {
  const [topicCount, postCount] = await Promise.all([
    prisma.topic.count({
      where: {
        userId,
        posts: { some: { status: PostStatus.PUBLISHED } },
      },
    }),
    prisma.post.count({
      where: { userId, status: PostStatus.PUBLISHED },
    }),
  ]);

  return { topicCount, postCount };
}

/**
 * Lists published posts for a public portfolio.
 * Inputs: userId. Output: published post summaries, newest first.
 */
export async function listPublishedPostsForAuthor(
  userId: string,
): Promise<PublicPostSummary[]> {
  return prisma.post.findMany({
    where: { userId, status: PostStatus.PUBLISHED },
    orderBy: { publishedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      publishedAt: true,
      createdAt: true,
    },
  });
}

/**
 * Fetches one published post by author username and slug.
 * Inputs: username, slug. Output: post with author or null.
 */
export async function getPublishedPostByUsernameAndSlug(
  username: string,
  slug: string,
) {
  const author = await getPublicAuthorByUsername(username);
  if (!author) {
    return null;
  }

  const post = await prisma.post.findFirst({
    where: {
      userId: author.id,
      slug,
      status: PostStatus.PUBLISHED,
    },
  });

  if (!post) {
    return null;
  }

  return { author, post };
}

/**
 * Returns previous/next published posts in the same topic as the current post.
 * Order follows topic page ordering (newest first by publishedAt).
 */
export async function getTopicAdjacentPostsForPublishedPost(
  userId: string,
  postId: string,
): Promise<TopicAdjacentPosts | null> {
  const current = await prisma.post.findFirst({
    where: {
      id: postId,
      userId,
      status: PostStatus.PUBLISHED,
    },
    select: {
      id: true,
      topicId: true,
    },
  });

  if (!current?.topicId) {
    return null;
  }

  const topic = await prisma.topic.findFirst({
    where: {
      id: current.topicId,
      userId,
    },
    select: {
      name: true,
      slug: true,
      posts: {
        where: { status: PostStatus.PUBLISHED },
        orderBy: [{ publishedAt: "asc" }, { createdAt: "asc" }],
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          publishedAt: true,
          createdAt: true,
        },
      },
    },
  });

  if (!topic) {
    return null;
  }

  const index = topic.posts.findIndex((p) => p.id === current.id);
  if (index === -1) {
    return null;
  }

  return {
    topic: {
      name: topic.name,
      slug: topic.slug,
    },
    previous: index > 0 ? topic.posts[index - 1] : null,
    next: index < topic.posts.length - 1 ? topic.posts[index + 1] : null,
  };
}

/**
 * Lists topics that have at least one published post, with those posts.
 * Inputs: userId. Output: topics with nested published summaries.
 */
export async function listPublicTopicsWithPosts(
  userId: string,
): Promise<PublicTopicWithPosts[]> {
  const topics = await prisma.topic.findMany({
    where: {
      userId,
      posts: { some: { status: PostStatus.PUBLISHED } },
    },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      posts: {
        where: { status: PostStatus.PUBLISHED },
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          publishedAt: true,
          createdAt: true,
        },
      },
    },
  });

  return topics;
}

/**
 * Lists published posts with no topic.
 * Inputs: userId. Output: published summaries.
 */
export async function listPublishedPostsWithoutTopic(
  userId: string,
): Promise<PublicPostSummary[]> {
  return prisma.post.findMany({
    where: { userId, status: PostStatus.PUBLISHED, topicId: null },
    orderBy: { publishedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      publishedAt: true,
      createdAt: true,
    },
  });
}

/**
 * Fetches a topic and its published posts for a public author.
 * Inputs: userId, topic slug. Output: topic with posts or null.
 */
export async function getPublicTopicByUsernameAndSlug(
  userId: string,
  topicSlug: string,
) {
  const topic = await prisma.topic.findFirst({
    where: { userId, slug: topicSlug },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      posts: {
        where: { status: PostStatus.PUBLISHED },
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          publishedAt: true,
          createdAt: true,
        },
      },
    },
  });

  if (!topic || topic.posts.length === 0) {
    return null;
  }

  return topic;
}
