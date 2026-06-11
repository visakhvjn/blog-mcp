import { SignInButton } from "@/components/sign-in-button";
import Link from "next/link";

type MobileAuthFabProps = {
  isAuthenticated: boolean;
  dashboardHref: string;
};

function SignInIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <polyline points="10 17 15 12 10 7" />
      <line x1="15" y1="12" x2="3" y2="12" />
    </svg>
  );
}

function DashboardIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
  );
}

/**
 * Fixed bottom-right auth FAB on mobile (Sign in or Dashboard).
 */
export function MobileAuthFab({
  isAuthenticated,
  dashboardHref,
}: MobileAuthFabProps) {
  return (
    <div
      className="fixed z-50 sm:hidden"
      style={{
        right: "max(1.25rem, env(safe-area-inset-right))",
        bottom: "max(1.25rem, env(safe-area-inset-bottom))",
      }}
    >
      {isAuthenticated ? (
        <Link
          href={dashboardHref}
          className="btn-mobile-fab"
          aria-label="Dashboard"
        >
          <DashboardIcon />
        </Link>
      ) : (
        <SignInButton
          returnTo="/dashboard"
          className="btn-mobile-fab"
          aria-label="Sign in"
        >
          <SignInIcon />
        </SignInButton>
      )}
    </div>
  );
}
