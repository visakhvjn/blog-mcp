import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { MobileAuthFab } from "@/components/mobile-auth-fab";
import { SiteNavbar } from "@/components/site-navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { getAppSession } from "@/lib/app-session";
import { BRAND_TAGLINE, BRAND_TITLE } from "@/lib/brand";
import { themeInitScript } from "@/lib/theme";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: BRAND_TITLE,
  description: `${BRAND_TAGLINE} for AI assistants. Connect Cursor, VS Code, or ChatGPT via MCP and publish to a live portfolio.`,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getAppSession();
  const isAuthenticated = Boolean(session?.user);
  const dashboardHref = session?.user?.username ? "/dashboard" : "/onboarding";

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased mobile-auth-fab-offset`}
      >
        <ThemeProvider>
          <SiteNavbar session={session} />
          {children}
          <MobileAuthFab
            isAuthenticated={isAuthenticated}
            dashboardHref={dashboardHref}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
