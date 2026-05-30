import { authenticateApiKey } from "@/lib/auth-api-key";
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

/**
 * Authenticates via browser session or Bearer API key (OpenAPI / Custom GPT).
 */
export async function requireApiUser(
  request: Request,
): Promise<SessionUser | NextResponse> {
  const session = await getAppSession();
  if (session?.user?.id) {
    return {
      id: session.user.id,
      username: session.user.username,
    };
  }

  const apiKey = await authenticateApiKey(request);
  if (apiKey) {
    return {
      id: apiKey.userId,
      username: apiKey.username,
    };
  }

  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function isAuthError(
  result: SessionUser | NextResponse,
): result is NextResponse {
  return result instanceof NextResponse;
}
