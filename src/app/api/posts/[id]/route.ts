import { isAuthError, requireApiUser } from "@/lib/api-auth";
import { updatePostSchema } from "@/lib/post-validation";
import {
  deletePost,
  getPostByIdForUser,
  updatePost,
} from "@/services/post-service";
import { NextResponse } from "next/server";
import { z } from "zod";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * GET /api/posts/:id — fetch one post owned by the signed-in user.
 */
export async function GET(
  request: Request,
  context: RouteContext,
): Promise<NextResponse> {
  const userOrError = await requireApiUser(request);
  if (isAuthError(userOrError)) {
    return userOrError;
  }

  const { id } = await context.params;
  const post = await getPostByIdForUser(id, userOrError.id);
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json({ post });
}

/**
 * PATCH /api/posts/:id — update a post (JSON body).
 */
export async function PATCH(
  request: Request,
  context: RouteContext,
): Promise<NextResponse> {
  const userOrError = await requireApiUser(request);
  if (isAuthError(userOrError)) {
    return userOrError;
  }

  const { id } = await context.params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  let input;
  try {
    input = updatePostSchema.parse(body);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.issues[0]?.message ?? "Validation failed" },
        { status: 400 },
      );
    }
    throw err;
  }

  const post = await updatePost(id, userOrError.id, input);
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json({ post });
}

/**
 * DELETE /api/posts/:id — delete a post owned by the signed-in user.
 */
export async function DELETE(
  request: Request,
  context: RouteContext,
): Promise<NextResponse> {
  const userOrError = await requireApiUser(request);
  if (isAuthError(userOrError)) {
    return userOrError;
  }

  const { id } = await context.params;
  const deleted = await deletePost(id, userOrError.id);
  if (!deleted) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
