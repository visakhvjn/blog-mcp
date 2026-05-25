import { prisma } from "@/lib/prisma";
import type { UpdateProfileInput } from "@/lib/user-validation";

export type UserProfile = {
  id: string;
  username: string;
  name: string | null;
  image: string | null;
  summary: string | null;
};

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
