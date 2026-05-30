import {
  getOpenApiSpec,
  getOpenApiSpecJson,
  OPENAPI_CORS_HEADERS,
  OPENAPI_JSON_HEADERS,
  OPENAPI_YAML_HEADERS,
} from "@/lib/openapi-spec";

/**
 * GET /api/openapi — public OpenAPI spec (YAML by default, JSON if requested).
 */
export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const wantsJson =
    searchParams.get("format") === "json" ||
    request.headers.get("accept")?.includes("application/json");

  if (wantsJson) {
    return Response.json(getOpenApiSpecJson(), { headers: OPENAPI_JSON_HEADERS });
  }

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
