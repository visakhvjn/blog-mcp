import Link from "next/link";

/**
 * Link that starts Auth0 sign-in.
 */
export function SignInButton({
  returnTo = "/dashboard",
  className = "btn-primary w-full inline-flex items-center justify-center",
  children = "Sign in",
  "aria-label": ariaLabel,
}: {
  returnTo?: string;
  className?: string;
  children?: React.ReactNode;
  "aria-label"?: string;
}) {
  const href = `/auth/login?returnTo=${encodeURIComponent(returnTo)}`;

  return (
    <Link href={href} className={className} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}
