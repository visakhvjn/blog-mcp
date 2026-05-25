import { GoogleSignInButton } from "@/components/google-sign-in-button";
import Link from "next/link";

type HomeCtaProps = {
  isAuthenticated: boolean;
  dashboardHref: string;
  large?: boolean;
};

/**
 * Primary call-to-action block respecting auth state.
 */
export function HomeCta({
  isAuthenticated,
  dashboardHref,
  large = false,
}: HomeCtaProps) {
  if (isAuthenticated) {
    return (
      <Link
        href={dashboardHref}
        className={large ? "btn-primary-lg" : "btn-primary"}
      >
        Go to dashboard
      </Link>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
      <div className={large ? "w-full sm:w-auto sm:min-w-[200px]" : "w-full sm:w-auto"}>
        <GoogleSignInButton callbackUrl="/dashboard" />
      </div>
      <a
        href="#pricing"
        className={
          large
            ? "btn-secondary w-full px-6 py-3.5 text-center text-base sm:w-auto"
            : "btn-secondary w-full text-center sm:w-auto"
        }
      >
        View pricing
      </a>
    </div>
  );
}
