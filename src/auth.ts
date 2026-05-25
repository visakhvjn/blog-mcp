import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { prisma } from "@/lib/prisma";
import { syncUserFromOAuth } from "@/services/user-service";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  callbacks: {
    /**
     * Persist Google profile to MongoDB on each sign-in.
     */
    async signIn({ user }) {
      if (!user.email) {
        console.error("[auth] Google sign-in denied: no email on user profile");
        return false;
      }

      try {
        await syncUserFromOAuth({
          email: user.email,
          name: user.name ?? null,
          image: user.image ?? null,
        });
      } catch (err) {
        console.error("[auth] signIn sync failed:", err);
        return false;
      }

      return true;
    },
    /**
     * Attach DB user id and username to the JWT (refreshed from DB on each token use).
     */
    async jwt({ token, user }) {
      if (user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
        });
        if (dbUser) {
          token.sub = dbUser.id;
          token.username = dbUser.username;
        }
        return token;
      }

      if (token.sub) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
        });
        if (dbUser) {
          token.username = dbUser.username;
        }
      }

      return token;
    },
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.username =
          typeof token.username === "string" ? token.username : null;
      }
      return session;
    },
  },
});
