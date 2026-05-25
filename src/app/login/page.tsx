import { GoogleSignInButton } from "@/components/google-sign-in-button";
import { PageShell } from "@/components/page-shell";
import Link from "next/link";

export const metadata = {
  title: "Sign in — Blog MCP",
};

type PageProps = {
  searchParams: Promise<{ error?: string }>;
};

/**
 * Maps Auth.js error codes to user-facing sign-in messages.
 */
function getLoginErrorMessage(error: string | undefined): string | null {
  if (!error) {
    return null;
  }
  if (error === "AccessDenied") {
    return "Sign-in was denied. This usually means the app could not save your account to the database. On Vercel, confirm DATABASE_URL is set and MongoDB Atlas allows connections from anywhere (0.0.0.0/0), then redeploy.";
  }
  if (error === "Configuration") {
    return "Auth is misconfigured. Check AUTH_SECRET, AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET, and AUTH_URL on your host.";
  }
  return "Sign-in failed. Please try again.";
}

export default async function LoginPage({ searchParams }: PageProps) {
  const { error } = await searchParams;
  const errorMessage = getLoginErrorMessage(error);

  return (
    <PageShell centered>
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text)]">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-secondary">
            Use your Google account to continue.
          </p>
        </div>

        {errorMessage ? (
          <div
            className="rounded-lg border border-[var(--danger)]/30 bg-[var(--danger-soft)] px-4 py-3 text-sm text-[var(--text)]"
            role="alert"
          >
            {errorMessage}
          </div>
        ) : null}

        <div className="card p-6">
          <GoogleSignInButton callbackUrl="/dashboard" />
        </div>
        <p className="text-center text-sm text-muted">
          <Link href="/" className="link">
            Back to home
          </Link>
        </p>
      </div>
    </PageShell>
  );
}
