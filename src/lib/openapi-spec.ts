import { readFileSync } from "node:fs";
import { join } from "node:path";

let cachedSpec: string | null = null;

/**
 * Reads the OpenAPI spec from the project root (cached after first read).
 */
export function getOpenApiSpec(): string {
  if (cachedSpec === null) {
    cachedSpec = readFileSync(join(process.cwd(), "openapi.yaml"), "utf8");
  }
  return cachedSpec;
}
