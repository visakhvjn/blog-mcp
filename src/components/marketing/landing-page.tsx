import { EngineHeroVisual } from "@/components/marketing/engine-hero-visual";
import { BuiltByAttribution } from "@/components/site-footer";
import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/brand";
import Link from "next/link";

const connectOptions = [
  {
    title: "Editor assistants",
    description:
      `Plug ${BRAND_NAME} into Cursor, VS Code, or any MCP-enabled editor. Your assistant calls create_post, list_posts, and publish — without leaving your workflow.`,
    detail: "MCP server + API key",
    example: 'create_post → "Why I build in public"',
  },
  {
    title: "Conversational assistants",
    description:
      `Import ${BRAND_NAME}'s OpenAPI spec into a Custom GPT as Actions. Draft posts, manage topics, and publish from a chat — ${BRAND_NAME} handles storage and delivery.`,
    detail: "OpenAPI Actions + API key",
    example: '"List my posts and draft a weekly update."',
  },
];

const features = [
  {
    title: "Generate from anywhere",
    description:
      `Assistants call ${BRAND_NAME} via MCP or REST API — wherever you already work with AI.`,
    icon: "✦",
  },
  {
    title: "Publish instantly",
    description:
      `${BRAND_NAME} writes to your live blog at /username — shareable posts and a portfolio you're proud of.`,
    icon: "◎",
  },
  {
    title: "You own the pipeline",
    description:
      "Markdown posts, drafts vs published, topics, and a dashboard when you want to manage things by hand.",
    icon: "◈",
  },
];

const steps = [
  {
    step: "01",
    title: "Sign in & claim your namespace",
    description:
      "Sign in in seconds. Pick a username that becomes your public content hub at /username.",
  },
  {
    step: "02",
    title: `Connect an assistant to ${BRAND_NAME}`,
    description:
      "Generate an API key and follow the setup guide — MCP for your editor, or Actions for a Custom GPT.",
  },
  {
    step: "03",
    title: "Generate & publish",
    description:
      `Your assistant creates content; ${BRAND_NAME} stores, organizes, and serves it live on the web.`,
  },
];

/**
 * Full marketing home page: hero, connect, features, how-it-works.
 */
export function LandingPage() {
  return (
    <div className="hero-glow min-h-screen">
      {/* Hero */}
      <section className="section-pad pt-16 sm:pt-24">
        <div className="marketing-container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-[var(--text)] sm:text-6xl">
              <span className="text-[var(--accent)]">{BRAND_NAME}</span>
            </h1>
            <p className="mt-3 text-xl text-secondary sm:text-2xl">
              {BRAND_TAGLINE}
            </p>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-secondary">
              Plug Cursor, VS Code, or ChatGPT into {BRAND_NAME} — turn
              assistant output into a live portfolio, not another folder of
              drafts.
            </p>
          </div>

          {/* Hero visual */}
          <div className="mx-auto mt-16 max-w-4xl">
            <EngineHeroVisual />
          </div>
        </div>
      </section>

      {/* Connect */}
      <section id="connect" className="section-pad border-t border-[var(--border-subtle)]">
        <div className="marketing-container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
              Plug assistants into {BRAND_NAME}
            </h2>
            <p className="mt-4 text-secondary">
              Two integration points into the same pipeline — pick the workflow
              that fits how you already work with AI.
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
              What {BRAND_TAGLINE} handles
            </h2>
            <p className="mt-4 text-secondary">
              One pipeline for AI-native content generation and a portfolio you
              actually maintain.
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
              Assistant → {BRAND_NAME} → Live
            </h2>
            <p className="mt-4 text-secondary">
              A simple pipeline designed for builders who create content with
              AI — in the editor or in ChatGPT.
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

      {/* Footer */}
      <footer className="border-t border-[var(--border-subtle)] bg-[var(--surface)] py-10">
        <div className="marketing-container flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} {BRAND_NAME} · {BRAND_TAGLINE} ·{" "}
            <BuiltByAttribution />
          </p>
          <div className="flex gap-6 text-sm text-secondary">
            <Link href="/" className="hover:text-[var(--text)]">
              Discover
            </Link>
            <a href="#connect" className="hover:text-[var(--text)]">
              Integrations
            </a>
            <a href="#features" className="hover:text-[var(--text)]">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-[var(--text)]">
              How it works
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
