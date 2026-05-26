import { authenticateMcpRequest } from "@/lib/auth-mcp";
import { getAppBaseUrl, getAuth0Issuer } from "@/lib/app-base-url";
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

function unauthorizedResponse(): Response {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...MCP_HEADERS,
  };

  const issuer = getAuth0Issuer();
  const resource = `${getAppBaseUrl()}/api/mcp`;
  if (issuer) {
    headers["WWW-Authenticate"] =
      `Bearer resource="${resource}", authorization_uri="${issuer}"`;
  }

  return new Response(
    JSON.stringify({
      jsonrpc: "2.0",
      error: { code: -32001, message: "Unauthorized" },
      id: null,
    }),
    { status: 401, headers },
  );
}

async function handleMcpRequest(request: Request): Promise<Response> {
  const auth = await authenticateMcpRequest(request);
  if (!auth) {
    return unauthorizedResponse();
  }

  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    select: { id: true, username: true },
  });
  if (!user) {
    return unauthorizedResponse();
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

export async function POST(request: Request): Promise<Response> {
  return handleMcpRequest(request);
}

export async function GET(request: Request): Promise<Response> {
  return handleMcpRequest(request);
}

export async function DELETE(request: Request): Promise<Response> {
  return handleMcpRequest(request);
}

export async function OPTIONS(): Promise<Response> {
  return new Response(null, { status: 204, headers: MCP_HEADERS });
}
