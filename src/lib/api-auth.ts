import { getAppSession } from "@/lib/app-session";
import { NextResponse } from "next/server";

export type SessionUser = {
  id: string;
  username?: string | null;
};

export async function requireSessionUser(): Promise<
  SessionUser | NextResponse
> {
  const session = await getAppSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return {
    id: session.user.id,
    username: session.user.username,
  };
}

export function isAuthError(
  result: SessionUser | NextResponse,
): result is NextResponse {
  return result instanceof NextResponse;
}
