import { auth0 } from "@/lib/auth0";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const RESERVED = new Set([
  "login",
  "onboarding",
  "dashboard",
  "api",
  "auth",
  "_next",
]);

function isPublicPortfolioPath(path: string): boolean {
  const segments = path.split("/").filter(Boolean);
  if (segments.length < 1 || segments.length > 3) {
    return false;
  }
  if (RESERVED.has(segments[0])) {
    return false;
  }
  if (segments.length === 1) {
    return true;
  }
  if (segments.length === 2 && segments[1] !== "topics") {
    return true;
  }
  return segments.length === 3 && segments[1] === "topics";
}

/**
 * Auth0 session routes + protection for dashboard, login, and onboarding.
 */
export async function middleware(request: NextRequest) {
  const authRes = await auth0.middleware(request);

  if (request.nextUrl.pathname.startsWith("/auth")) {
    return authRes;
  }

  const path = request.nextUrl.pathname.replace(/\/$/, "") || "/";

  if (
    path.startsWith("/api/mcp") ||
    path.startsWith("/.well-known") ||
    path === "/" ||
    isPublicPortfolioPath(path)
  ) {
    return authRes;
  }

  const isLogin = path === "/login";
  const isProtected =
    isLogin || path === "/onboarding" || path.startsWith("/dashboard");

  if (!isProtected) {
    return authRes;
  }

  const session = await auth0.getSession(request);

  if (isLogin) {
    if (session) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return authRes;
  }

  if (!session) {
    const login = new URL("/auth/login", request.url);
    login.searchParams.set("returnTo", path);
    return NextResponse.redirect(login);
  }

  return authRes;
}

export const config = {
  matcher: ["/auth/:path*", "/login", "/onboarding", "/dashboard/:path*"],
};
