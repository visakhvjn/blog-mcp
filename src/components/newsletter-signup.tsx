"use client";

import { useState } from "react";

/**
 * Weekly newsletter email signup (UI; wire to provider later).
 */
export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) {
      return;
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <p className="mt-4 text-sm font-medium text-[var(--accent-muted)]" role="status">
        Thanks — you&apos;re on the list.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3">
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="you@example.com"
        className="input"
        autoComplete="email"
      />
      <button type="submit" className="btn-primary w-full">
        Subscribe
      </button>
    </form>
  );
}
