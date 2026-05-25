import { isReservedUsername } from "@/lib/reserved-usernames";
import { prisma } from "@/lib/prisma";
import { PostStatus } from "@prisma/client";

export type PublicAuthor = {
  id: string;
  username: string;
  name: string | null;
  image: string | null;
};

export type PublicPostSummary = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  publishedAt: Date | null;
  createdAt: Date;
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
    },
  });

  if (!user?.username) {
    return null;
  }

  return user as PublicAuthor;
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
