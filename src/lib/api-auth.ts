import { auth } from "@/auth";
import { NextResponse } from "next/server";

export type SessionUser = {
  id: string;
  username?: string | null;
};

/**
 * Returns the signed-in user for API routes or a 401 JSON response.
 * Inputs: none. Output: user object or NextResponse error.
 */
export async function requireSessionUser(): Promise<
  SessionUser | NextResponse
> {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return {
    id: session.user.id,
    username: session.user.username,
  };
}

/**
 * Type guard: true when requireSessionUser returned an error response.
 */
export function isAuthError(
  result: SessionUser | NextResponse,
): result is NextResponse {
  return result instanceof NextResponse;
}
