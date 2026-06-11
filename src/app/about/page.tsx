import { LandingPage } from "@/components/marketing/landing-page";
import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/brand";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `About — ${BRAND_TAGLINE}`,
  description: `${BRAND_TAGLINE} for AI assistants. Connect Cursor, VS Code, or ChatGPT via MCP and publish to a live portfolio with ${BRAND_NAME}.`,
};

export default function AboutPage() {
  return <LandingPage />;
}
