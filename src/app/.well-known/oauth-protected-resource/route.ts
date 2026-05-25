/**
 * Tells MCP clients this server uses API keys, not OAuth (RFC 9728).
 */
export async function GET(): Promise<Response> {
  const baseUrl = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? "";
  return Response.json({
    resource: `${baseUrl}/api/mcp`,
    authorization_servers: [],
    bearer_methods_supported: ["header"],
    resource_documentation: `${baseUrl}/dashboard/settings`,
  });
}
