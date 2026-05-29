import ReactMarkdown from "react-markdown";
import { isValidElement, type CSSProperties, type ReactNode } from "react";
import remarkGfm from "remark-gfm";
import { MermaidDiagram } from "@/components/mermaid-diagram";

type MarkdownContentProps = {
  content: string;
};

function textFromNode(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(textFromNode).join("");
  }
  if (!node || typeof node !== "object") {
    return "";
  }
  if ("props" in node && node.props) {
    return textFromNode((node.props as { children?: ReactNode }).children);
  }
  return "";
}

function getMermaidChart(children: ReactNode): string | null {
  if (!isValidElement(children)) {
    return null;
  }
  const props = children.props as { className?: string; children?: ReactNode };
  if (!props.className?.includes("language-mermaid")) {
    return null;
  }
  return textFromNode(props.children).replace(/\n$/, "");
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Renders markdown post body with soothing typography.
 */
export function MarkdownContent({ content }: MarkdownContentProps) {
  const seen = new Map<string, number>();
  const getHeadingId = (children: ReactNode) => {
    const text = textFromNode(children).trim();
    const base = slugify(text) || "section";
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    return count === 0 ? base : `${base}-${count + 1}`;
  };

  return (
    <article
      className={[
        "max-w-none text-[var(--text-secondary)]",
        "[&_h1]:scroll-mt-24 [&_h2]:scroll-mt-24 [&_h3]:scroll-mt-24 [&_h4]:scroll-mt-24 [&_h5]:scroll-mt-24 [&_h6]:scroll-mt-24",
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
        "[&_pre]:mb-4 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-[var(--border)] [&_pre]:bg-[var(--code-bg)] [&_pre]:p-4",
        "[&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-[var(--code-text)]",
        "[&_img]:mb-4 [&_img]:max-w-full [&_img]:rounded-xl",
        "[&_del]:text-muted [&_del]:line-through",
      ].join(" ")}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h1 id={getHeadingId(children)}>{children}</h1>,
          h2: ({ children }) => <h2 id={getHeadingId(children)}>{children}</h2>,
          h3: ({ children }) => <h3 id={getHeadingId(children)}>{children}</h3>,
          h4: ({ children }) => <h4 id={getHeadingId(children)}>{children}</h4>,
          h5: ({ children }) => <h5 id={getHeadingId(children)}>{children}</h5>,
          h6: ({ children }) => <h6 id={getHeadingId(children)}>{children}</h6>,
          pre: ({ children }) => {
            const chart = getMermaidChart(children);
            if (chart !== null) {
              return <MermaidDiagram chart={chart} />;
            }
            return <pre>{children}</pre>;
          },
          table: ({ children }) => (
            <div className="mb-4 overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)]">
              <table className="w-full min-w-[16rem] border-collapse text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-[var(--surface-muted)]">{children}</thead>
          ),
          th: ({ children, style }) => (
            <th
              className="border-b border-[var(--border)] px-4 py-2.5 font-semibold text-[var(--text)]"
              style={style as CSSProperties | undefined}
            >
              {children}
            </th>
          ),
          td: ({ children, style }) => (
            <td
              className="border-b border-[var(--border-subtle)] px-4 py-2.5 text-[var(--text-secondary)]"
              style={style as CSSProperties | undefined}
            >
              {children}
            </td>
          ),
          tr: ({ children }) => (
            <tr className="[&:last-child_td]:border-b-0 [&:last-child_th]:border-b-0">
              {children}
            </tr>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
