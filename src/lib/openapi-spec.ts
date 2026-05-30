import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";

let cachedSpec: string | null = null;
let cachedJson: Record<string, unknown> | null = null;

/**
 * Reads the OpenAPI spec from the project root (cached after first read).
 */
export function getOpenApiSpec(): string {
  if (cachedSpec === null) {
    cachedSpec = readFileSync(join(process.cwd(), "openapi.yaml"), "utf8");
  }
  return cachedSpec;
}

/**
 * Parses the OpenAPI spec as JSON for clients that cannot import YAML URLs.
 */
export function getOpenApiSpecJson(): Record<string, unknown> {
  if (cachedJson === null) {
    cachedJson = parse(getOpenApiSpec()) as Record<string, unknown>;
  }
  return cachedJson;
}

export const OPENAPI_CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Cache-Control": "public, max-age=3600",
} as const;

export const OPENAPI_YAML_HEADERS = {
  ...OPENAPI_CORS_HEADERS,
  "Content-Type": "text/yaml; charset=utf-8",
  "Content-Disposition": 'inline; filename="openapi.yaml"',
  "X-Content-Type-Options": "nosniff",
} as const;

export const OPENAPI_JSON_HEADERS = {
  ...OPENAPI_CORS_HEADERS,
  "Content-Type": "application/json; charset=utf-8",
  "Content-Disposition": 'inline; filename="openapi.json"',
  "X-Content-Type-Options": "nosniff",
} as const;
