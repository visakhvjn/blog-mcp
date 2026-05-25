import { GoogleSignInButton } from "@/components/google-sign-in-button";
import Link from "next/link";

export const metadata = {
  title: "Sign in — Blog MCP",
};

/**
 * Login page: Google OAuth entry point.
 */
export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Sign in
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Use your Google account to continue.
          </p>
        </div>
        <GoogleSignInButton callbackUrl="/dashboard" />
        <p className="text-center text-sm text-zinc-500">
          <Link href="/" className="hover:underline">
            Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
