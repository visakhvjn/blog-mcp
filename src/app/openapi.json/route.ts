import {
  getOpenApiSpecJson,
  OPENAPI_CORS_HEADERS,
  OPENAPI_JSON_HEADERS,
} from "@/lib/openapi-spec";

/**
 * GET /openapi.json — public OpenAPI spec (JSON) for Custom GPT URL import.
 */
export async function GET(): Promise<Response> {
  return Response.json(getOpenApiSpecJson(), { headers: OPENAPI_JSON_HEADERS });
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
