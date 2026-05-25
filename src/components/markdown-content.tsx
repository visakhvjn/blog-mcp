import ReactMarkdown from "react-markdown";

type MarkdownContentProps = {
  content: string;
};

/**
 * Renders markdown post body with basic typography styles.
 * Inputs: markdown string. Output: styled article element.
 */
export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <article
      className={[
        "max-w-none text-zinc-700 dark:text-zinc-300",
        "[&_h1]:mb-4 [&_h1]:mt-8 [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:text-zinc-900 dark:[&_h1]:text-zinc-50",
        "[&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-zinc-900 dark:[&_h2]:text-zinc-50",
        "[&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:text-lg [&_h3]:font-medium",
        "[&_p]:mb-4 [&_p]:leading-7",
        "[&_a]:underline [&_a]:text-zinc-900 dark:[&_a]:text-zinc-100",
        "[&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6",
        "[&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6",
        "[&_li]:mb-1",
        "[&_blockquote]:mb-4 [&_blockquote]:border-l-4 [&_blockquote]:border-zinc-300 [&_blockquote]:pl-4 [&_blockquote]:italic",
        "[&_code]:rounded [&_code]:bg-zinc-100 [&_code]:px-1 [&_code]:font-mono [&_code]:text-sm dark:[&_code]:bg-zinc-800",
        "[&_pre]:mb-4 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-zinc-100 [&_pre]:p-4 dark:[&_pre]:bg-zinc-900",
        "[&_pre_code]:bg-transparent [&_pre_code]:p-0",
        "[&_img]:mb-4 [&_img]:max-w-full [&_img]:rounded-lg",
      ].join(" ")}
    >
      <ReactMarkdown>{content}</ReactMarkdown>
    </article>
  );
}
