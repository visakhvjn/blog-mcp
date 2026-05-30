import { HomeCta } from "@/components/marketing/home-cta";
import { SiteHeader } from "@/components/marketing/site-header";
import { BuiltByAttribution } from "@/components/site-footer";
import Link from "next/link";
import type { AppSession } from "@/lib/app-session";

type LandingPageProps = {
  session: AppSession | null;
};

const connectOptions = [
  {
    title: "Your IDE",
    description:
      "Plug Blog MCP into Cursor, VS Code, or any MCP-enabled editor. Draft, edit, and publish without leaving your codebase.",
    detail: "MCP server + API key",
    example: 'create_post → "Why I build in public"',
  },
  {
    title: "ChatGPT",
    description:
      "Import the Blog MCP API into a Custom GPT as Actions. List posts, create drafts, manage topics, and publish from a conversation.",
    detail: "OpenAPI Actions + API key",
    example: '“List my blog posts and draft a weekly update.”',
  },
];

const features = [
  {
    title: "Write with AI",
    description:
      "Publish from your IDE or ChatGPT — wherever you already work with an assistant.",
    icon: "✦",
  },
  {
    title: "Your public portfolio",
    description:
      "Every user gets a clean public blog at /username — shareable posts and a profile you're proud of.",
    icon: "◎",
  },
  {
    title: "Full control",
    description:
      "Markdown posts, drafts vs published, and a dashboard when you want to manage things by hand.",
    icon: "◈",
  },
];

const steps = [
  {
    step: "01",
    title: "Sign in & claim your name",
    description: "Sign in in seconds. Pick a username that becomes your public URL.",
  },
  {
    step: "02",
    title: "Connect your IDE or ChatGPT",
    description:
      "Generate an API key and follow the setup guide — MCP for your editor, or Actions for a Custom GPT.",
  },
  {
    step: "03",
    title: "Publish your presence",
    description:
      "Ship posts as drafts or go live instantly. Build an online presence that grows with you.",
  },
];

const planFeatures = [
  "Personal blog at /your-username",
  "AI Publishing from your IDE or ChatGPT",
  "Unlimited published posts",
  "Topics to organize your writing",
  "Secure sign-in",
  "Custom domain (coming soon)",
];

/**
 * Full marketing home page: hero, features, how-it-works, pricing.
 */
export function LandingPage({ session }: LandingPageProps) {
  const isAuthenticated = Boolean(session?.user);
  const dashboardHref = session?.user?.username
    ? "/dashboard"
    : "/onboarding";

  return (
    <div className="hero-glow min-h-screen">
      <SiteHeader
        isAuthenticated={isAuthenticated}
        dashboardHref={dashboardHref}
      />

      {/* Hero */}
      <section className="section-pad pt-16 sm:pt-24">
        <div className="marketing-container">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-4 py-1.5 text-sm text-secondary shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
              Build your online presence using AI
            </p>
            <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-[var(--text)] sm:text-6xl">
              Your blog.
              <br />
              <span className="text-[var(--accent)]">Powered by your assistant.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-secondary">
              Blog MCP turns your IDE or ChatGPT into a publishing engine — so
              you can grow a real portfolio, not just a pile of drafts.
            </p>
            <div className="mt-10">
              <HomeCta
                isAuthenticated={isAuthenticated}
                dashboardHref={dashboardHref}
                large
              />
            </div>
            <p className="mt-4 text-sm text-muted">
              $0 for 3 months · No credit card · Setup in under 2 minutes
            </p>
          </div>

          {/* Hero visual */}
          <div className="mx-auto mt-16 max-w-4xl">
            <div className="card overflow-hidden p-2 shadow-md sm:p-3">
              <div className="grid gap-2 sm:grid-cols-3">
                <div className="rounded-lg bg-[var(--surface-muted)] p-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted">
                    In your IDE
                  </p>
                  <p className="mt-3 font-mono text-sm text-[var(--text)]">
                    create_post → &quot;Why I build in public&quot;
                  </p>
                  <p className="mt-2 font-mono text-xs text-muted">
                    status: PUBLISHED
                  </p>
                </div>
                <div className="rounded-lg bg-[var(--surface-muted)] p-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted">
                    In ChatGPT
                  </p>
                  <p className="mt-3 text-sm text-[var(--text)]">
                    &quot;Draft a post about what I shipped this week.&quot;
                  </p>
                  <p className="mt-2 text-xs text-muted">Custom GPT Actions</p>
                </div>
                <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] p-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted">
                    Live on the web
                  </p>
                  <p className="mt-3 text-lg font-medium text-[var(--text)]">
                    Why I build in public
                  </p>
                  <p className="mt-2 text-sm text-secondary">
                    /your-username/why-i-build-in-public
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Connect */}
      <section id="connect" className="section-pad border-t border-[var(--border-subtle)]">
        <div className="marketing-container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
              Connect your IDE or ChatGPT
            </h2>
            <p className="mt-4 text-secondary">
              Two ways to publish — pick the workflow that fits how you already
              write with AI.
            </p>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {connectOptions.map((option) => (
              <div key={option.title} className="card flex flex-col p-6">
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--accent)]">
                  {option.detail}
                </p>
                <h3 className="mt-3 text-xl font-medium text-[var(--text)]">
                  {option.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-secondary">
                  {option.description}
                </p>
                <p className="mt-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-muted)] px-3 py-2 font-mono text-xs text-[var(--text)]">
                  {option.example}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-secondary">
            Setup instructions live in{" "}
            <Link href="/dashboard/settings" className="link">
              AI Publishing settings
            </Link>{" "}
            after you sign in.
          </p>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="section-pad bg-[var(--surface-muted)]">
        <div className="marketing-container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
              Everything you need to show up online
            </h2>
            <p className="mt-4 text-secondary">
              One platform for AI-native writing and a portfolio you actually
              maintain.
            </p>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="card p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-lg text-[var(--accent)]">
                  {f.icon}
                </span>
                <h3 className="mt-4 text-lg font-medium text-[var(--text)]">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-secondary">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="section-pad">
        <div className="marketing-container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
              From idea to live post in minutes
            </h2>
            <p className="mt-4 text-secondary">
              A simple flow designed for builders who write with AI — in the
              editor or in ChatGPT.
            </p>
          </div>
          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            {steps.map((s) => (
              <div key={s.step} className="relative">
                <span className="font-mono text-4xl font-semibold text-[var(--accent-muted)]">
                  {s.step}
                </span>
                <h3 className="mt-4 text-lg font-medium text-[var(--text)]">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-secondary">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="section-pad bg-[var(--surface-muted)]">
        <div className="marketing-container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
              Simple, honest pricing
            </h2>
            <p className="mt-4 text-secondary">
              One simple plan. Free for your first 3 months.
            </p>
          </div>

          <div className="pricing-card pricing-card-featured mx-auto mt-14 flex max-w-md flex-col">
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-semibold text-[var(--text)]">
                $3
              </span>
              <span className="text-secondary">/month</span>
            </div>
            <p className="mt-2 text-lg font-medium text-[var(--accent-muted)]">
              $0 for your first 3 months
            </p>
            <p className="mt-2 text-sm text-secondary">
              Everything included. Cancel anytime.
            </p>
            <ul className="mt-8 flex-1 space-y-3">
              {planFeatures.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-secondary">
                  <span className="text-[var(--accent)]">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <HomeCta
                isAuthenticated={isAuthenticated}
                dashboardHref={dashboardHref}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border-subtle)] bg-[var(--surface)] py-10">
        <div className="marketing-container flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} Blog MCP · <BuiltByAttribution />
          </p>
          <div className="flex gap-6 text-sm text-secondary">
            <a href="#connect" className="hover:text-[var(--text)]">
              Connect
            </a>
            <a href="#features" className="hover:text-[var(--text)]">
              Features
            </a>
            <a href="#pricing" className="hover:text-[var(--text)]">
              Pricing
            </a>
            <Link href="/login" className="hover:text-[var(--text)]">
              Sign in
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
