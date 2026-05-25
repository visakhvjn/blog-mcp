import { GoogleSignInButton } from "@/components/google-sign-in-button";
import { PageShell } from "@/components/page-shell";
import Link from "next/link";

export const metadata = {
  title: "Sign in — Blog MCP",
};

export default function LoginPage() {
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
