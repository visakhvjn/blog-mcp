"use client";

import Link from "next/link";
import { useState } from "react";

type ClientId = "cursor" | "vscode" | "custom-gpt";

const CLIENTS: { id: ClientId; label: string }[] = [
  { id: "cursor", label: "Cursor" },
  { id: "vscode", label: "VS Code" },
  { id: "custom-gpt", label: "Custom GPT" },
];

type ClientConnectTabsProps = {
  mcpUrl: string;
  appBaseUrl: string;
};

function buildCursorConfig(mcpUrl: string) {
  return `{
  "mcpServers": {
    "blog-mcp": {
      "url": "${mcpUrl}",
      "headers": {
        "Authorization": "Bearer \${env:BLOG_MCP_API_KEY}"
      }
    }
  }
}`;
}

function buildVsCodeConfig(mcpUrl: string) {
  return `{
  "servers": {
    "blog-mcp": {
      "type": "http",
      "url": "${mcpUrl}",
      "headers": {
        "Authorization": "Bearer \${input:blog-mcp-api-key}"
      }
    }
  }
}`;
}

/**
 * Tabbed setup instructions for AI Publishing clients (Cursor, VS Code, Custom GPT, …).
 */
export function ClientConnectTabs({ mcpUrl, appBaseUrl }: ClientConnectTabsProps) {
  const [active, setActive] = useState<ClientId>("cursor");
  const openapiUrl = `${appBaseUrl}/openapi.json`;

  return (
    <section className="card space-y-4 p-6">
      <h2 className="text-lg font-medium text-[var(--text)]">
        Connect your client
      </h2>

      <nav
        className="flex flex-wrap gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-muted)] p-1.5"
        aria-label="Client"
      >
        {CLIENTS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActive(id)}
            className={
              active === id
                ? "rounded-lg bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--text)] shadow-sm"
                : "rounded-lg px-4 py-2 text-sm font-medium text-[var(--text-secondary)] transition hover:text-[var(--text)]"
            }
          >
            {label}
          </button>
        ))}
      </nav>

      {active === "cursor" && (
        <div className="space-y-4">
          <ol className="list-decimal space-y-2 pl-5 text-sm text-secondary">
            <li>Generate an API key above and copy it.</li>
            <li>
              Add to your shell:{" "}
              <code className="rounded bg-[var(--surface-muted)] px-1.5 py-0.5 font-mono text-xs">
                export BLOG_MCP_API_KEY=your-key
              </code>
            </li>
            <li>
              Press{" "}
              <kbd className="rounded border border-[var(--border)] bg-[var(--surface-muted)] px-1.5 py-0.5 font-mono text-xs">
                Ctrl+Shift+P
              </kbd>{" "}
              (Mac:{" "}
              <kbd className="rounded border border-[var(--border)] bg-[var(--surface-muted)] px-1.5 py-0.5 font-mono text-xs">
                Cmd+Shift+P
              </kbd>
              ) to open the Command Palette.
            </li>
            <li>
              Search for{" "}
              <span className="font-medium text-[var(--text)]">
                Cursor Settings
              </span>
              , open the{" "}
              <span className="font-medium text-[var(--text)]">MCP</span>{" "}
              section, and click{" "}
              <span className="font-medium text-[var(--text)]">
                Add new global MCP server
              </span>{" "}
              (opens your user-level{" "}
              <code className="rounded bg-[var(--surface-muted)] px-1.5 py-0.5 font-mono text-xs">
                ~/.cursor/mcp.json
              </code>
              , not a project file).
            </li>
            <li>Paste the configuration below and save.</li>
            <li>
              From the Command Palette, run{" "}
              <span className="font-medium text-[var(--text)]">
                Developer: Reload Window
              </span>{" "}
              or restart Cursor.
            </li>
          </ol>
          <pre className="code-block">{buildCursorConfig(mcpUrl)}</pre>
        </div>
      )}

      {active === "vscode" && (
        <div className="space-y-4">
          <ol className="list-decimal space-y-2 pl-5 text-sm text-secondary">
            <li>Generate an API key above and copy it.</li>
            <li>
              Press{" "}
              <kbd className="rounded border border-[var(--border)] bg-[var(--surface-muted)] px-1.5 py-0.5 font-mono text-xs">
                Ctrl+Shift+P
              </kbd>{" "}
              (Mac:{" "}
              <kbd className="rounded border border-[var(--border)] bg-[var(--surface-muted)] px-1.5 py-0.5 font-mono text-xs">
                Cmd+Shift+P
              </kbd>
              ) to open the Command Palette.
            </li>
            <li>
              Run{" "}
              <span className="font-medium text-[var(--text)]">
                MCP: Open User Configuration
              </span>{" "}
              to open your user-level{" "}
              <code className="rounded bg-[var(--surface-muted)] px-1.5 py-0.5 font-mono text-xs">
                mcp.json
              </code>{" "}
              (available in all workspaces, not tied to a project folder).
            </li>
            <li>Paste the configuration below and save.</li>
            <li>
              When VS Code starts the server, paste your API key at the prompt.
              From the Command Palette, run{" "}
              <span className="font-medium text-[var(--text)]">
                MCP: List Servers
              </span>{" "}
              to start or restart the server.
            </li>
          </ol>
          <pre className="code-block">{buildVsCodeConfig(mcpUrl)}</pre>
        </div>
      )}

      {active === "custom-gpt" && (
        <div className="space-y-4">
          <p className="text-sm text-secondary">
            Import the REST API into a Custom GPT as{" "}
            <span className="font-medium text-[var(--text)]">Actions</span>.
            Auth uses an API key from the section above (Bearer{" "}
            <code className="rounded bg-[var(--surface-muted)] px-1 py-0.5 font-mono text-xs">
              blog_…
            </code>
            ).
          </p>
          <ol className="list-decimal space-y-2 pl-5 text-sm text-secondary">
            <li>Generate an API key above and copy it.</li>
            <li>
              In ChatGPT, go to{" "}
              <span className="font-medium text-[var(--text)]">
                My GPTs → Create
              </span>{" "}
              (or edit an existing GPT).
            </li>
            <li>
              Open{" "}
              <span className="font-medium text-[var(--text)]">Configure</span>
              , scroll to{" "}
              <span className="font-medium text-[var(--text)]">Actions</span>,
              and click{" "}
              <span className="font-medium text-[var(--text)]">
                Create new action
              </span>
              .
            </li>
            <li>
              Choose{" "}
              <span className="font-medium text-[var(--text)]">
                Import from URL
              </span>{" "}
              and paste:
              <pre className="code-block mt-2">{openapiUrl}</pre>
            </li>
            <li>
              Under Authentication, select{" "}
              <span className="font-medium text-[var(--text)]">API Key</span>,
              set Auth type to{" "}
              <span className="font-medium text-[var(--text)]">Bearer</span>,
              and paste your API key.
            </li>
            <li>
              Save the GPT. Test with prompts like “List my blog posts” or
              “Create a draft post titled Weekly update.”
            </li>
          </ol>
          <p className="text-sm text-secondary">
            OpenAPI reference:{" "}
            <Link href="/docs" className="link">
              /docs
            </Link>
            {" · "}
            <a href={openapiUrl} className="link">
              /openapi.json
            </a>
          </p>
        </div>
      )}
    </section>
  );
}
