import { CreateApiKeyForm } from "@/components/create-api-key-form";
import { RevokeApiKeyButton } from "@/components/revoke-api-key-button";
import { DashboardNav } from "@/components/dashboard-nav";
import { SignOutButton } from "@/components/sign-out-button";
import { requireUser } from "@/lib/require-user";
import { listApiKeysForUser } from "@/services/api-key-service";

export const metadata = {
  title: "MCP settings — Blog MCP",
};

/**
 * API key management and Cursor MCP connection instructions.
 */
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
    <div className="mx-auto min-h-screen max-w-2xl px-4 py-12">
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            MCP settings
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Connect Cursor or any MCP client with an API key.
          </p>
        </div>
        <SignOutButton />
      </header>

      <DashboardNav />

      <section className="mb-10 space-y-4">
        <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
          API keys
        </h2>
        <CreateApiKeyForm />

        {keys.length > 0 ? (
          <ul className="divide-y divide-zinc-200 rounded-xl border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
            {keys.map((key) => (
              <li
                key={key.id}
                className="flex items-center justify-between gap-4 p-4"
              >
                <div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">
                    {key.name}
                  </p>
                  <p className="font-mono text-xs text-zinc-500">
                    {key.keyPrefix}…
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    Created {key.createdAt.toLocaleDateString()}
                    {key.lastUsedAt
                      ? ` · Last used ${key.lastUsedAt.toLocaleDateString()}`
                      : ""}
                  </p>
                </div>
                <RevokeApiKeyButton keyId={key.id} keyName={key.name} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-zinc-500">No API keys yet.</p>
        )}
      </section>

      <section className="space-y-4 rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
        <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
          Connect in Cursor
        </h2>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-zinc-600 dark:text-zinc-400">
          <li>Generate an API key above and copy it.</li>
          <li>
            Add to your shell:{" "}
            <code className="rounded bg-white px-1 dark:bg-zinc-800">
              export BLOG_MCP_API_KEY=your-key
            </code>
          </li>
          <li>
            Add to project{" "}
            <code className="rounded bg-white px-1 dark:bg-zinc-800">
              .cursor/mcp.json
            </code>{" "}
            (see below).
          </li>
          <li>Restart Cursor or reload MCP servers in settings.</li>
        </ol>
        <pre className="overflow-x-auto rounded-lg bg-zinc-900 p-4 text-xs text-zinc-100">
          {cursorConfig}
        </pre>
        <p className="text-xs text-zinc-500">
          MCP endpoint: <span className="font-mono">{mcpUrl}</span>
        </p>
        <p className="text-xs text-zinc-500">
          Tools: <span className="font-mono">list_posts</span>,{" "}
          <span className="font-mono">get_post</span>,{" "}
          <span className="font-mono">create_post</span>,{" "}
          <span className="font-mono">update_post</span>,{" "}
          <span className="font-mono">delete_post</span>
        </p>
      </section>
    </div>
  );
}
