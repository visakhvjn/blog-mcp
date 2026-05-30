import { isAuthError, requireApiUser } from "@/lib/api-auth";
import { createTopicSchema } from "@/lib/topic-validation";
import { createTopic, listTopicsByUser } from "@/services/topic-service";
import { NextResponse } from "next/server";
import { z } from "zod";

/**
 * GET /api/topics — list all topics for the signed-in user.
 */
export async function GET(request: Request): Promise<NextResponse> {
  const userOrError = await requireApiUser(request);
  if (isAuthError(userOrError)) {
    return userOrError;
  }

  const topics = await listTopicsByUser(userOrError.id);
  return NextResponse.json({ topics });
}

/**
 * POST /api/topics — create a topic (JSON body).
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
    input = createTopicSchema.parse(body);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.issues[0]?.message ?? "Validation failed" },
        { status: 400 },
      );
    }
    throw err;
  }

  const topic = await createTopic(userOrError.id, input);
  return NextResponse.json({ topic }, { status: 201 });
}
