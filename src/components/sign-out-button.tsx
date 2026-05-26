import Link from "next/link";

/**
 * Signs out via Auth0's mounted /auth/logout route.
 */
export function SignOutButton() {
  return (
    <Link href="/auth/logout" className="btn-ghost">
      Sign out
    </Link>
  );
}
