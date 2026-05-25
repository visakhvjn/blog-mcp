import ReactMarkdown from "react-markdown";

type MarkdownContentProps = {
  content: string;
};

/**
 * Renders markdown post body with soothing typography.
 */
export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <article
      className={[
        "max-w-none text-[var(--text-secondary)]",
        "[&_h1]:mb-4 [&_h1]:mt-10 [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:text-[var(--text)]",
        "[&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-[var(--text)]",
        "[&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-medium [&_h3]:text-[var(--text)]",
        "[&_p]:mb-4 [&_p]:leading-8",
        "[&_a]:font-medium [&_a]:text-[var(--accent)] [&_a]:underline [&_a]:underline-offset-2",
        "[&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6",
        "[&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6",
        "[&_li]:mb-1 [&_li]:leading-7",
        "[&_blockquote]:mb-4 [&_blockquote]:border-l-4 [&_blockquote]:border-[var(--accent)] [&_blockquote]:bg-[var(--surface-muted)] [&_blockquote]:py-1 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-[var(--text-secondary)]",
        "[&_code]:rounded [&_code]:bg-[var(--surface-muted)] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm [&_code]:text-[var(--text)]",
        "[&_pre]:mb-4 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-[var(--border)] [&_pre]:bg-[#2a2724] [&_pre]:p-4",
        "[&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-[#f0ede8]",
        "[&_img]:mb-4 [&_img]:max-w-full [&_img]:rounded-xl",
      ].join(" ")}
    >
      <ReactMarkdown>{content}</ReactMarkdown>
    </article>
  );
}
