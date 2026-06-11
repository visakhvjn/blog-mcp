"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/brand";
import Link from "next/link";

declare global {
  interface Window {
    SwaggerUIBundle?: (config: Record<string, unknown>) => void;
  }
}

/**
 * Public Swagger UI for the dumpd! REST API.
 */
export default function ApiDocsPage() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!ready || !window.SwaggerUIBundle) {
      return;
    }

    window.SwaggerUIBundle({
      url: "/api/openapi",
      dom_id: "#swagger-ui",
      deepLinking: true,
      persistAuthorization: true,
    });
  }, [ready]);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css"
      />
      <Script
        src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js"
        strategy="afterInteractive"
        onLoad={() => setReady(true)}
      />

      <div className="border-b border-[var(--border-subtle)] bg-[var(--surface)] px-4 py-3">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-medium text-[var(--text)]">
              {BRAND_NAME} API
            </h1>
            <p className="text-sm text-muted">{BRAND_TAGLINE}</p>
            <p className="text-sm text-muted">
              Import URL for Custom GPT:{" "}
              <a
                href="/openapi.json"
                className="text-[var(--accent)] hover:underline"
              >
                /openapi.json
              </a>
              {" · "}
              <a
                href="/openapi.yaml"
                className="text-[var(--accent)] hover:underline"
              >
                /openapi.yaml
              </a>
            </p>
          </div>
          <Link
            href="/"
            className="text-sm text-secondary hover:text-[var(--text)]"
          >
            ← Home
          </Link>
        </div>
      </div>

      <main id="swagger-ui" />
    </>
  );
}
