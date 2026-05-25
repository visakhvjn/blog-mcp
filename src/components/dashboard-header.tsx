import type { ReactNode } from "react";
import { SignOutButton } from "@/components/sign-out-button";

type DashboardHeaderProps = {
  title: string;
  subtitle?: ReactNode;
};

/**
 * Dashboard page title row with sign-out action.
 */
export function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  return (
    <header className="mb-8 flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--text)]">
          {title}
        </h1>
        {subtitle ? (
          <div className="mt-1.5 text-sm text-secondary">{subtitle}</div>
        ) : null}
      </div>
      <SignOutButton />
    </header>
  );
}
