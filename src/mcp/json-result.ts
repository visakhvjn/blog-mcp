/**
 * Formats data as MCP tool text content (JSON).
 * Inputs: any JSON-serializable value. Output: MCP content block array.
 */
export function jsonToolResult(data: unknown): {
  content: Array<{ type: "text"; text: string }>;
  isError?: boolean;
} {
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(data, null, 2),
      },
    ],
  };
}

/**
 * Formats an error message for MCP tool responses.
 * Inputs: message string. Output: MCP error content.
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
