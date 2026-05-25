"use server";

import { auth } from "@/auth";
import {
  createApiKeyForUser,
  revokeApiKeyForUser,
} from "@/services/api-key-service";
import { revalidatePath } from "next/cache";

export type CreateApiKeyState = {
  error?: string;
  fullKey?: string;
  name?: string;
};

/**
 * Creates an API key for the signed-in user.
 * Inputs: previous state, FormData with `name`. Output: state with fullKey once.
 */
export async function createApiKeyAction(
  _prevState: CreateApiKeyState,
  formData: FormData,
): Promise<CreateApiKeyState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be signed in." };
  }

  const name = formData.get("name");
  if (typeof name !== "string" || !name.trim()) {
    return { error: "Name is required." };
  }

  try {
    const { fullKey } = await createApiKeyForUser(session.user.id, name);
    revalidatePath("/dashboard/settings");
    return { fullKey, name: name.trim() };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Failed to create key.",
    };
  }
}

/**
 * Revokes an API key owned by the signed-in user.
 * Inputs: keyId. Output: revalidates settings page.
 */
export async function revokeApiKeyAction(keyId: string): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) {
    return;
  }
  await revokeApiKeyForUser(keyId, session.user.id);
  revalidatePath("/dashboard/settings");
}
