"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { parseUsername } from "@/lib/username";
import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import { z } from "zod";

export type SetUsernameState = {
  error?: string;
};

/**
 * Saves the authenticated user's unique username and redirects to the dashboard.
 * Inputs: previous state, FormData with `username`. Output: redirect or error state.
 */
export async function setUsername(
  _prevState: SetUsernameState,
  formData: FormData,
): Promise<SetUsernameState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be signed in." };
  }

  const raw = formData.get("username");
  if (typeof raw !== "string") {
    return { error: "Username is required." };
  }

  let username: string;
  try {
    username = parseUsername(raw);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { error: err.issues[0]?.message ?? "Invalid username." };
    }
    return { error: "Invalid username." };
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { username },
    });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      return { error: "That username is already taken." };
    }
    throw err;
  }

  redirect("/dashboard");
}
