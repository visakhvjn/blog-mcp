import {
  getOpenApiSpec,
  OPENAPI_CORS_HEADERS,
  OPENAPI_YAML_HEADERS,
} from "@/lib/openapi-spec";

/**
 * GET /openapi.yaml — public OpenAPI spec (YAML, inline).
 */
export async function GET(): Promise<Response> {
  return new Response(getOpenApiSpec(), { headers: OPENAPI_YAML_HEADERS });
}

export async function OPTIONS(): Promise<Response> {
  return new Response(null, {
    status: 204,
    headers: {
      ...OPENAPI_CORS_HEADERS,
      "Access-Control-Allow-Methods": "GET, OPTIONS",
    },
  });
}
