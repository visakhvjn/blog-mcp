import { SignInButton } from "@/components/sign-in-button";
import { PageShell } from "@/components/page-shell";
import Link from "next/link";

export const metadata = {
  title: "Sign in — Blog MCP",
};

type PageProps = {
  searchParams: Promise<{ error?: string }>;
};

function getLoginErrorMessage(error: string | undefined): string | null {
  if (!error) {
    return null;
  }
  if (error === "AccessDenied") {
    return "Sign-in was denied. Confirm DATABASE_URL is set and MongoDB is reachable, then try again.";
  }
  if (error === "auth" || error === "Configuration") {
    return "Auth is misconfigured. Check Auth0 env vars (AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, AUTH0_SECRET, APP_BASE_URL).";
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
            Sign in to manage your blog and MCP keys.
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
          <SignInButton returnTo="/dashboard" />
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
