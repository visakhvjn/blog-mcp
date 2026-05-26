"use client";

import { Loader } from "@/components/loader";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useFormStatus } from "react-dom";

type FormSubmitButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  /** Shown next to the spinner while the form is submitting. */
  pendingLabel?: string;
};

/**
 * Submit button that shows a loader while its parent form is pending.
 */
export function FormSubmitButton({
  children,
  pendingLabel,
  className = "",
  disabled,
  ...props
}: FormSubmitButtonProps) {
  const { pending } = useFormStatus();

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
          <span>{pendingLabel ?? children}</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}
