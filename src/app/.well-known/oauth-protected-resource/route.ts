import { getAppBaseUrl, getAuth0Issuer } from "@/lib/app-base-url";

/**
 * RFC 9728 metadata so ChatGPT discovers Auth0 for MCP OAuth.
 */
export async function GET(): Promise<Response> {
  const baseUrl = getAppBaseUrl();
  const issuer = getAuth0Issuer();

  return Response.json({
    resource: `${baseUrl}/api/mcp`,
    authorization_servers: issuer ? [issuer] : [],
    bearer_methods_supported: ["header"],
    scopes_supported: [
      "openid",
      "profile",
      "email",
      "offline_access",
    ],
    resource_documentation: `${baseUrl}/dashboard/settings`,
  });
}
