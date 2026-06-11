import { ClientConnectTabs } from "@/components/client-connect-tabs";
import { CreateApiKeyForm } from "@/components/create-api-key-form";
import { DeleteApiKeyButton } from "@/components/delete-api-key-button";
import { DashboardNav } from "@/components/dashboard-nav";
import { DashboardHeader } from "@/components/dashboard-header";
import { PageShell } from "@/components/page-shell";
import { BRAND_NAME } from "@/lib/brand";
import { getAppBaseUrl } from "@/lib/app-base-url";
import { requireUser } from "@/lib/require-user";
import { listApiKeysForUser } from "@/services/api-key-service";

export const metadata = {
  title: `AI Publishing settings — ${BRAND_NAME}`,
};

export default async function SettingsPage() {
  const user = await requireUser();
  const keys = await listApiKeysForUser(user.id);
  const appBaseUrl = getAppBaseUrl();
  const mcpUrl = `${appBaseUrl}/api/mcp`;

  return (
    <PageShell wide>
      <DashboardHeader
        title="AI Publishing settings"
        subtitle="Connect your AI Publishing client with an API key"
      />
      <DashboardNav />

      <section className="mb-10 space-y-4">
        <h2 className="text-lg font-medium text-[var(--text)]">API keys</h2>

        <div className="space-y-3">
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
          <CreateApiKeyForm />
        </div>
      </section>

      <ClientConnectTabs mcpUrl={mcpUrl} appBaseUrl={appBaseUrl} />
    </PageShell>
  );
}
