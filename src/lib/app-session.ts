import { auth0 } from "@/lib/auth0";
import { prisma } from "@/lib/prisma";
import { syncUserFromAuth0 } from "@/services/user-service";

export type AppSessionUser = {
  id: string;
  username: string | null;
  email?: string | null;
  name?: string | null;
  image?: string | null;
};

export type AppSession = {
  user: AppSessionUser;
};

type SessionUserWithClaims = {
  sub?: string;
  email?: string;
  name?: string;
  picture?: string;
};

/**
 * Returns the signed-in app user (MongoDB id + username) from the Auth0 session.
 */
export async function getAppSession(): Promise<AppSession | null> {
  const session = await auth0.getSession();
  if (!session?.user) {
    return null;
  }

  const user = session.user as SessionUserWithClaims;
  const email = user.email;
  const auth0Sub = user.sub;
  if (!email || !auth0Sub) {
    return null;
  }

  let dbUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true, username: true, name: true, image: true },
  });

  if (!dbUser) {
    dbUser = await syncUserFromAuth0({
      auth0Sub,
      email,
      name: user.name ?? null,
      image: user.picture ?? null,
    });
  }

  return {
    user: {
      id: dbUser.id,
      username: dbUser.username,
      email,
      name: dbUser.name,
      image: dbUser.image,
    },
  };
}
