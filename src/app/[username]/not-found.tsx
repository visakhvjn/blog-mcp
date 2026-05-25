import Link from "next/link";

/**
 * Shown when username or published post does not exist.
 */
export default function PortfolioNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Page not found
      </h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        This blog or post does not exist, or it is not published yet.
      </p>
      <Link
        href="/"
        className="mt-6 text-sm font-medium text-zinc-900 underline dark:text-zinc-100"
      >
        Go home
      </Link>
    </div>
  );
}
