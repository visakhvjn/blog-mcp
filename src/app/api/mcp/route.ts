import { authenticateApiKey } from "@/lib/auth-api-key";
import { createBlogMcpServer } from "@/mcp/create-blog-mcp-server";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const MCP_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, mcp-session-id, mcp-protocol-version, Last-Event-ID",
};

/**
 * Handles MCP Streamable HTTP after API key authentication.
 * Inputs: authenticated Request. Output: MCP protocol Response.
 */
async function handleMcpRequest(request: Request): Promise<Response> {
  const auth = await authenticateApiKey(request);
  if (!auth) {
    return new Response(
      JSON.stringify({
        jsonrpc: "2.0",
        error: { code: -32001, message: "Unauthorized" },
        id: null,
      }),
      { status: 401, headers: { "Content-Type": "application/json" } },
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    select: { id: true, username: true },
  });
  if (!user) {
    return new Response(
      JSON.stringify({
        jsonrpc: "2.0",
        error: { code: -32001, message: "Unauthorized" },
        id: null,
      }),
      { status: 401, headers: { "Content-Type": "application/json" } },
    );
  }

  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });
  const server = createBlogMcpServer({
    userId: user.id,
    username: user.username,
  });

  await server.connect(transport);
  const response = await transport.handleRequest(request);

  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(MCP_HEADERS)) {
    headers.set(key, value);
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

/** POST — MCP JSON-RPC messages */
export async function POST(request: Request): Promise<Response> {
  return handleMcpRequest(request);
}

/** GET — MCP SSE stream (some clients) */
export async function GET(request: Request): Promise<Response> {
  return handleMcpRequest(request);
}

/** DELETE — MCP session teardown */
export async function DELETE(request: Request): Promise<Response> {
  return handleMcpRequest(request);
}

/** OPTIONS — CORS preflight */
export async function OPTIONS(): Promise<Response> {
  return new Response(null, { status: 204, headers: MCP_HEADERS });
}
