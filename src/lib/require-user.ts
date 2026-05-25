import { auth } from "@/auth";
import { redirect } from "next/navigation";

export type RequiredUser = {
  id: string;
  username: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

/**
 * Loads session and redirects if not signed in or missing username.
 * Inputs: none. Output: authenticated user with username set.
 */
export async function requireUser(): Promise<RequiredUser> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  if (!session.user.username) {
    redirect("/onboarding");
  }
  return {
    id: session.user.id,
    username: session.user.username,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
  };
}
