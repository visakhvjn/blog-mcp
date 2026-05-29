"use client";

import { useEffect, useId, useState } from "react";

type MermaidDiagramProps = {
  chart: string;
};

let mermaidInitialized = false;

/**
 * Renders a Mermaid diagram from a fenced code block (```mermaid).
 */
export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const reactId = useId().replace(/:/g, "");
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        const mermaid = (await import("mermaid")).default;
        if (!mermaidInitialized) {
          mermaid.initialize({
            startOnLoad: false,
            theme: "dark",
            securityLevel: "strict",
            fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
          });
          mermaidInitialized = true;
        }

        const renderId = `mermaid-${reactId}`;
        const { svg: rendered } = await mermaid.render(renderId, chart.trim());
        if (!cancelled) {
          setSvg(rendered);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to render diagram",
          );
        }
      }
    }

    void render();
    return () => {
      cancelled = true;
    };
  }, [chart, reactId]);

  if (error) {
    return (
      <div className="mb-4 rounded-xl border border-[var(--danger)]/30 bg-[var(--danger-soft)] p-4">
        <p className="text-sm font-medium text-[var(--text)]">
          Could not render diagram
        </p>
        <pre className="mt-2 overflow-x-auto text-xs text-muted">{error}</pre>
        <pre className="mt-3 overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--code-bg)] p-3 text-xs text-[var(--code-text)]">
          {chart.trim()}
        </pre>
      </div>
    );
  }

  if (!svg) {
    return (
      <div
        className="mb-4 flex min-h-32 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] text-sm text-muted"
        aria-busy="true"
      >
        Loading diagram…
      </div>
    );
  }

  return (
    <div
      className="mermaid-diagram mb-4 overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-4 [&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-w-full"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
