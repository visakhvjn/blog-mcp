import { CreateApiKeyForm } from "@/components/create-api-key-form";
import { DeleteApiKeyButton } from "@/components/delete-api-key-button";
import { DashboardNav } from "@/components/dashboard-nav";
import { DashboardHeader } from "@/components/dashboard-header";
import { PageShell } from "@/components/page-shell";
import { requireUser } from "@/lib/require-user";
import { listApiKeysForUser } from "@/services/api-key-service";

export const metadata = {
  title: "MCP settings — Blog MCP",
};

export default async function SettingsPage() {
  const user = await requireUser();
  const keys = await listApiKeysForUser(user.id);
  const mcpUrl = `${process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/api/mcp`;

  const cursorConfig = `{
  "mcpServers": {
    "blog-mcp": {
      "url": "${mcpUrl}",
      "headers": {
        "Authorization": "Bearer \${env:BLOG_MCP_API_KEY}"
      }
    }
  }
}`;

  return (
    <PageShell wide>
      <DashboardHeader
        title="MCP settings"
        subtitle="Connect Cursor or any MCP client with an API key"
      />
      <DashboardNav />

      <section className="mb-10 space-y-4">
        <h2 className="text-lg font-medium text-[var(--text)]">API keys</h2>

        <div className="space-y-3">
          <h3 className="text-sm font-medium text-secondary">
            Keys created so far
          </h3>
          {keys.length > 0 ? (
            <ul className="card divide-y divide-[var(--border-subtle)] overflow-hidden">
              {keys.map((key) => (
                <li
                  key={key.id}
                  className="flex items-center justify-between gap-4 p-4"
                >
                  <div>
                    <p className="font-medium text-[var(--text)]">{key.name}</p>
                    <p className="font-mono text-xs text-muted">
                      {key.keyPrefix}…
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      Created {key.createdAt.toLocaleDateString()}
                      {key.lastUsedAt
                        ? ` · Last used ${key.lastUsedAt.toLocaleDateString()}`
                        : " · Never used"}
                    </p>
                  </div>
                  <DeleteApiKeyButton keyId={key.id} keyName={key.name} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted">No API keys yet.</p>
          )}
        </div>

        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-medium text-secondary">
            Create a new key
          </h3>
          <CreateApiKeyForm />
        </div>
      </section>

      <section className="card space-y-4 p-6">
        <h2 className="text-lg font-medium text-[var(--text)]">
          Connect in Cursor
        </h2>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-secondary">
          <li>Generate an API key above and copy it.</li>
          <li>
            Add to your shell:{" "}
            <code className="rounded bg-[var(--surface-muted)] px-1.5 py-0.5 font-mono text-xs">
              export BLOG_MCP_API_KEY=your-key
            </code>
          </li>
          <li>
            Add to project{" "}
            <code className="rounded bg-[var(--surface-muted)] px-1.5 py-0.5 font-mono text-xs">
              .cursor/mcp.json
            </code>
          </li>
          <li>Restart Cursor or reload MCP servers.</li>
        </ol>
        <pre className="code-block">{cursorConfig}</pre>
        <p className="text-xs text-muted">
          Endpoint: <span className="font-mono">{mcpUrl}</span>
        </p>
        <p className="text-xs text-muted">
          Tools: list_posts, get_post, create_post, update_post, delete_post
        </p>
      </section>
    </PageShell>
  );
}
