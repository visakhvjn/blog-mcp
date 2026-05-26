import { prisma } from "@/lib/prisma";
import type { UpdateProfileInput } from "@/lib/user-validation";
import type { User } from "@prisma/client";

export type OAuthUserProfile = {
  email: string;
  name: string | null;
  image: string | null;
};

export type Auth0UserProfile = OAuthUserProfile & {
  auth0Sub: string;
};

export type UserProfile = {
  id: string;
  username: string;
  name: string | null;
  image: string | null;
  summary: string | null;
};

/**
 * Creates or updates a user from Auth0 without Prisma upsert (MongoDB M0 has no transactions).
 */
export async function syncUserFromAuth0(
  profile: Auth0UserProfile,
): Promise<User> {
  const bySub = await prisma.user.findUnique({
    where: { auth0Sub: profile.auth0Sub },
  });

  if (bySub) {
    return prisma.user.update({
      where: { auth0Sub: profile.auth0Sub },
      data: {
        email: profile.email,
        name: profile.name,
        image: profile.image,
      },
    });
  }

  const byEmail = await prisma.user.findUnique({
    where: { email: profile.email },
  });

  if (byEmail) {
    return prisma.user.update({
      where: { email: profile.email },
      data: {
        auth0Sub: profile.auth0Sub,
        name: profile.name,
        image: profile.image,
      },
    });
  }

  return prisma.user.create({
    data: {
      auth0Sub: profile.auth0Sub,
      email: profile.email,
      name: profile.name,
      image: profile.image,
    },
  });
}

/**
 * Loads profile fields for the signed-in user.
 * Inputs: userId. Output: profile row or null.
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      name: true,
      image: true,
      summary: true,
    },
  });

  if (!user?.username) {
    return null;
  }

  return user as UserProfile;
}

/**
 * Updates the user's public profile summary.
 * Inputs: userId, patch (empty summary clears the field). Output: updated profile or null.
 */
export async function updateUserProfile(
  userId: string,
  input: UpdateProfileInput,
): Promise<UserProfile | null> {
  const existing = await getUserProfile(userId);
  if (!existing) {
    return null;
  }

  const summary =
    input.summary === undefined
      ? existing.summary
      : input.summary.trim() === ""
        ? null
        : input.summary.trim();

  const user = await prisma.user.update({
    where: { id: userId },
    data: { summary },
    select: {
      id: true,
      username: true,
      name: true,
      image: true,
      summary: true,
    },
  });

  return user as UserProfile;
}
