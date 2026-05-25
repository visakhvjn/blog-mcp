import { auth } from "@/auth";
import { GoogleSignInButton } from "@/components/google-sign-in-button";
import Link from "next/link";

/**
 * Public landing page with sign-in CTA or dashboard link when authenticated.
 */
export default async function HomePage() {
  const session = await auth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <main className="w-full max-w-lg text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Blog MCP
        </h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          A blogging platform built for writing with Cursor and MCP. Phase 1:
          sign in, pick a username, and you are ready for what comes next.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4">
          {session?.user ? (
            <>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Signed in as{" "}
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {session.user.email}
                </span>
                {session.user.username ? (
                  <>
                    {" "}
                    ·{" "}
                    <span className="font-mono">@{session.user.username}</span>
                  </>
                ) : null}
              </p>
              <Link
                href={
                  session.user.username ? "/dashboard" : "/onboarding"
                }
                className="rounded-lg bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
              >
                {session.user.username
                  ? "Go to dashboard"
                  : "Finish setup"}
              </Link>
            </>
          ) : (
            <div className="w-full max-w-sm">
              <GoogleSignInButton callbackUrl="/dashboard" />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
