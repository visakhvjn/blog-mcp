import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

/**
 * Protects auth routes. Username redirects are handled in page components
 * (server-side auth() refreshes JWT from DB; middleware runs on Edge without Prisma).
 */
export default auth((req) => {
  const path = req.nextUrl.pathname.replace(/\/$/, "") || "/";
  const isLogin = path === "/login";

  if (isLogin) {
    if (req.auth) {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }
    return NextResponse.next();
  }

  if (!req.auth) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/login", "/onboarding", "/dashboard/:path*"],
};
