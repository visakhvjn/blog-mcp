import { toMcpStructured } from "@/mcp/tool-schemas";

/**
 * MCP tool success result with structuredContent (outputSchema) and text fallback.
 */
export function jsonToolResult<T extends Record<string, unknown>>(data: T): {
  structuredContent: T;
  content: Array<{ type: "text"; text: string }>;
} {
  const structuredContent = toMcpStructured(data);
  return {
    structuredContent,
    content: [
      {
        type: "text",
        text: JSON.stringify(structuredContent, null, 2),
      },
    ],
  };
}

/**
 * Formats an error message for MCP tool responses.
 */
export function mcpToolError(message: string): {
  content: Array<{ type: "text"; text: string }>;
  isError: true;
} {
  return {
    content: [{ type: "text", text: message }],
    isError: true,
  };
}
