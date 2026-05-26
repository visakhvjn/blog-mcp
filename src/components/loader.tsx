type LoaderProps = {
  /** Visual size of the spinner. */
  size?: "sm" | "md";
  className?: string;
};

const sizeClass = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
} as const;

/**
 * Accessible spinning loader for async UI.
 */
export function Loader({ size = "md", className = "" }: LoaderProps) {
  return (
    <svg
      className={`animate-spin text-current ${sizeClass[size]} ${className}`.trim()}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
