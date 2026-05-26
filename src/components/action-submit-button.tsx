"use client";

import { Loader } from "@/components/loader";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ActionSubmitButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  pending: boolean;
  pendingLabel: string;
};

/**
 * Submit button with explicit pending state (e.g. useActionState).
 */
export function ActionSubmitButton({
  children,
  pending,
  pendingLabel,
  className = "",
  disabled,
  ...props
}: ActionSubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      aria-busy={pending}
      className={className}
      {...props}
    >
      {pending ? (
        <span className="inline-flex items-center justify-center gap-2">
          <Loader size="sm" />
          <span>{pendingLabel}</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}
