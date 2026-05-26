/**
 * Public app origin (no trailing slash). Used for MCP URLs and OAuth metadata.
 */
export function getAppBaseUrl(): string {
  return (
    process.env.APP_BASE_URL ??
    process.env.AUTH_URL ??
    process.env.NEXTAUTH_URL ??
    "http://localhost:3000"
  );
}

/**
 * Auth0 tenant issuer URL with trailing slash.
 */
export function getAuth0Issuer(): string | null {
  const domain = process.env.AUTH0_DOMAIN;
  if (!domain) {
    return null;
  }
  return `https://${domain}/`;
}
