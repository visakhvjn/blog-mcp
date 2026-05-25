import { auth } from "@/auth";
import { LandingPage } from "@/components/marketing/landing-page";

/**
 * Marketing home page for Blog MCP.
 */
export default async function HomePage() {
  const session = await auth();
  return <LandingPage session={session} />;
}
