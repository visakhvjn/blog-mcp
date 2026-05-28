import type { ReactNode } from "react";

type PageShellProps = {
  children: ReactNode;
  wide?: boolean;
  centered?: boolean;
  containerClassName?: string;
};

/**
 * Consistent page wrapper with soft background and max width.
 * Inputs: children, optional wide layout, optional vertical centering.
 * Output: page layout container.
 */
export function PageShell({
  children,
  wide = false,
  centered = false,
  containerClassName,
}: PageShellProps) {
  const defaultContainerClass = centered
    ? "flex min-h-screen flex-col items-center justify-center px-5 py-12"
    : wide
      ? "page-shell-wide"
      : "page-shell";

  return (
    <div className="page-bg">
      <div className={containerClassName ?? defaultContainerClass}>
        {children}
      </div>
    </div>
  );
}
