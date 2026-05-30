import { isAuthError, requireApiUser } from "@/lib/api-auth";
import { createPostSchema } from "@/lib/post-validation";
import { createPost, listPostsByUser } from "@/services/post-service";
import { NextResponse } from "next/server";
import { z } from "zod";

/**
 * GET /api/posts — list all posts for the signed-in user.
 */
export async function GET(request: Request): Promise<NextResponse> {
  const userOrError = await requireApiUser(request);
  if (isAuthError(userOrError)) {
    return userOrError;
  }

  const posts = await listPostsByUser(userOrError.id);
  return NextResponse.json({ posts });
}

/**
 * POST /api/posts — create a post (JSON body).
 */
export async function POST(request: Request): Promise<NextResponse> {
  const userOrError = await requireApiUser(request);
  if (isAuthError(userOrError)) {
    return userOrError;
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  let input;
  try {
    input = createPostSchema.parse(body);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.issues[0]?.message ?? "Validation failed" },
        { status: 400 },
      );
    }
    throw err;
  }

  const post = await createPost(userOrError.id, input);
  return NextResponse.json({ post }, { status: 201 });
}
