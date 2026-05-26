import { getAppSession } from "@/lib/app-session";
import { LandingPage } from "@/components/marketing/landing-page";

export default async function HomePage() {
  const session = await getAppSession();
  return <LandingPage session={session} />;
}
