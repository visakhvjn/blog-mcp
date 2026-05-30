import { isAuthError, requireApiUser } from "@/lib/api-auth";
import { updateTopicSchema } from "@/lib/topic-validation";
import {
  deleteTopic,
  getTopicByIdForUser,
  updateTopic,
} from "@/services/topic-service";
import { NextResponse } from "next/server";
import { z } from "zod";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * GET /api/topics/:id — fetch one topic owned by the signed-in user.
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
  const topic = await getTopicByIdForUser(id, userOrError.id);
  if (!topic) {
    return NextResponse.json({ error: "Topic not found" }, { status: 404 });
  }

  return NextResponse.json({ topic });
}

/**
 * PATCH /api/topics/:id — update a topic (JSON body).
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
    input = updateTopicSchema.parse(body);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.issues[0]?.message ?? "Validation failed" },
        { status: 400 },
      );
    }
    throw err;
  }

  const topic = await updateTopic(id, userOrError.id, input);
  if (!topic) {
    return NextResponse.json({ error: "Topic not found" }, { status: 404 });
  }

  return NextResponse.json({ topic });
}

/**
 * DELETE /api/topics/:id — delete a topic owned by the signed-in user.
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
  const deleted = await deleteTopic(id, userOrError.id);
  if (!deleted) {
    return NextResponse.json({ error: "Topic not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
