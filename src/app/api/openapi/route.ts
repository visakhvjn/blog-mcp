import { getOpenApiSpec } from "@/lib/openapi-spec";

const PUBLIC_HEADERS = {
  "Content-Type": "application/yaml; charset=utf-8",
  "Access-Control-Allow-Origin": "*",
  "Cache-Control": "public, max-age=3600",
};

/**
 * GET /api/openapi — public OpenAPI spec (YAML).
 */
export async function GET(): Promise<Response> {
  return new Response(getOpenApiSpec(), { headers: PUBLIC_HEADERS });
}

export async function OPTIONS(): Promise<Response> {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
    },
  });
}
