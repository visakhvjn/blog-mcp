import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { PostStatus } from "@prisma/client";
import { z } from "zod";
import {
  createPostSchema,
  updatePostSchema,
} from "@/lib/post-validation";
import { createTopicSchema } from "@/lib/topic-validation";
import {
  createPost,
  deletePost,
  getPostByIdForUser,
  getPostBySlugForUser,
  listPostsByUser,
  updatePost,
} from "@/services/post-service";
import {
  createTopic,
  deleteTopic,
  listTopicsByUser,
  resolveTopicRefForUser,
} from "@/services/topic-service";
import { jsonToolResult, mcpToolError } from "@/mcp/json-result";

type McpUserContext = {
  userId: string;
  username: string | null;
};

/**
 * Builds an MCP server with blog post tools scoped to one user.
 * Inputs: user id and username. Output: configured McpServer instance.
 */
export function createBlogMcpServer(ctx: McpUserContext): McpServer {
  const server = new McpServer({
    name: "blog-mcp",
    version: "1.0.0",
  });

  const baseUrl = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? "";

  server.registerTool(
    "list_posts",
    {
      description:
        "List blog posts for the authenticated user. Optional filter by DRAFT or PUBLISHED.",
      inputSchema: {
        status: z
          .enum([PostStatus.DRAFT, PostStatus.PUBLISHED])
          .optional()
          .describe("Filter by status"),
        limit: z
          .number()
          .int()
          .min(1)
          .max(100)
          .optional()
          .describe("Max posts to return (default 50)"),
        topicId: z.string().optional().describe("Filter by topic id"),
        unassignedOnly: z
          .boolean()
          .optional()
          .describe("If true, only posts with no topic"),
      },
    },
    async ({ status, limit, topicId, unassignedOnly }) => {
      const posts = await listPostsByUser(ctx.userId, {
        status,
        limit: limit ?? 50,
        topicId: unassignedOnly ? null : topicId,
      });
      return jsonToolResult({ posts });
    },
  );

  server.registerTool(
    "get_post",
    {
      description:
        "Get a single post by MongoDB id or by slug (provide one of id or slug).",
      inputSchema: {
        id: z.string().optional().describe("Post id"),
        slug: z.string().optional().describe("Post slug"),
      },
    },
    async ({ id, slug }) => {
      if (!id && !slug) {
        return mcpToolError("Provide either id or slug.");
      }
      const post = id
        ? await getPostByIdForUser(id, ctx.userId)
        : await getPostBySlugForUser(slug!, ctx.userId);
      if (!post) {
        return mcpToolError("Post not found.");
      }
      const publicUrl =
        ctx.username && post.status === PostStatus.PUBLISHED
          ? `${baseUrl}/${ctx.username}/${post.slug}`
          : null;
      return jsonToolResult({ post, publicUrl });
    },
  );

  server.registerTool(
    "list_topics",
    {
      description: "List all topics for the authenticated user.",
      inputSchema: {},
    },
    async () => {
      const topics = await listTopicsByUser(ctx.userId);
      return jsonToolResult({ topics });
    },
  );

  server.registerTool(
    "create_topic",
    {
      description: "Create a topic to group related posts.",
      inputSchema: {
        name: z.string().min(1).max(100),
        description: z.string().max(500).optional(),
        slug: z
          .string()
          .regex(/^[a-z0-9-]+$/)
          .max(80)
          .optional(),
      },
    },
    async (args) => {
      try {
        const input = createTopicSchema.parse(args);
        const topic = await createTopic(ctx.userId, input);
        const publicUrl = ctx.username
          ? `${baseUrl}/${ctx.username}/topics/${topic.slug}`
          : null;
        return jsonToolResult({ topic, publicUrl });
      } catch (err) {
        const message =
          err instanceof z.ZodError
            ? (err.issues[0]?.message ?? "Validation failed")
            : err instanceof Error
              ? err.message
              : "Create failed";
        return mcpToolError(message);
      }
    },
  );

  server.registerTool(
    "create_post",
    {
      description:
        "Create a new blog post (markdown content). Status DRAFT or PUBLISHED.",
      inputSchema: {
        title: z.string().min(1).max(200),
        content: z.string().min(1),
        excerpt: z.string().max(500).optional(),
        slug: z
          .string()
          .regex(/^[a-z0-9-]+$/)
          .max(80)
          .optional(),
        status: z
          .enum([PostStatus.DRAFT, PostStatus.PUBLISHED])
          .default(PostStatus.DRAFT),
        topicId: z.string().optional().describe("Topic id to assign"),
        topicSlug: z
          .string()
          .optional()
          .describe("Topic slug (used if topicId omitted)"),
      },
    },
    async (args) => {
      try {
        const { topicSlug, ...rest } = args;
        const topicId = await resolveTopicRefForUser(ctx.userId, {
          topicId: rest.topicId,
          topicSlug,
        });
        const input = createPostSchema.parse({ ...rest, topicId: topicId ?? undefined });
        const post = await createPost(ctx.userId, input);
        const publicUrl =
          ctx.username && post.status === PostStatus.PUBLISHED
            ? `${baseUrl}/${ctx.username}/${post.slug}`
            : null;
        return jsonToolResult({ post, publicUrl });
      } catch (err) {
        const message =
          err instanceof z.ZodError
            ? (err.issues[0]?.message ?? "Validation failed")
            : err instanceof Error
              ? err.message
              : "Create failed";
        return mcpToolError(message);
      }
    },
  );

  server.registerTool(
    "update_post",
    {
      description: "Update an existing post by id. Only set fields you change.",
      inputSchema: {
        id: z.string().describe("Post id"),
        title: z.string().min(1).max(200).optional(),
        content: z.string().min(1).optional(),
        excerpt: z.string().max(500).nullable().optional(),
        slug: z
          .string()
          .regex(/^[a-z0-9-]+$/)
          .max(80)
          .optional(),
        status: z.enum([PostStatus.DRAFT, PostStatus.PUBLISHED]).optional(),
        topicId: z
          .string()
          .nullable()
          .optional()
          .describe("Topic id; null to remove from topic"),
        topicSlug: z
          .string()
          .optional()
          .describe("Set topic by slug (ignored if topicId is null)"),
      },
    },
    async (args) => {
      const { id, topicSlug, ...rest } = args;
      try {
        let topicId = rest.topicId;
        if (topicId === undefined && topicSlug) {
          topicId = await resolveTopicRefForUser(ctx.userId, { topicSlug });
        } else if (topicId === undefined && topicSlug === undefined) {
          topicId = undefined;
        } else if (topicId !== null && topicSlug) {
          topicId = await resolveTopicRefForUser(ctx.userId, { topicSlug });
        }
        const input = updatePostSchema.parse({
          ...rest,
          ...(topicId !== undefined ? { topicId } : {}),
        });
        const post = await updatePost(id, ctx.userId, input);
        if (!post) {
          return mcpToolError("Post not found.");
        }
        const publicUrl =
          ctx.username && post.status === PostStatus.PUBLISHED
            ? `${baseUrl}/${ctx.username}/${post.slug}`
            : null;
        return jsonToolResult({ post, publicUrl });
      } catch (err) {
        const message =
          err instanceof z.ZodError
            ? (err.issues[0]?.message ?? "Validation failed")
            : err instanceof Error
              ? err.message
              : "Update failed";
        return mcpToolError(message);
      }
    },
  );

  server.registerTool(
    "delete_post",
    {
      description: "Permanently delete a post by id.",
      inputSchema: {
        id: z.string().describe("Post id to delete"),
      },
    },
    async ({ id }) => {
      const deleted = await deletePost(id, ctx.userId);
      if (!deleted) {
        return mcpToolError("Post not found.");
      }
      return jsonToolResult({ ok: true, deletedId: id });
    },
  );

  server.registerTool(
    "delete_topic",
    {
      description: "Permanently delete a topic by id.",
      inputSchema: {
        id: z.string().describe("Topic id to delete"),
      },
    },
    async ({ id }) => {
      const deleted = await deleteTopic(id, ctx.userId);
      if (!deleted) {
        return mcpToolError("Topic not found.");
      }
      return jsonToolResult({ ok: true, deletedId: id });
    },
  );

  return server;
}
