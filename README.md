# Blog MCP

Phased blogging platform with MCP authoring for Cursor. **Phase 1** includes Auth0 sign-in, username onboarding, and logout.

## Prerequisites

- Node.js 20+
- MongoDB Atlas cluster (or local MongoDB)
- [Auth0](https://auth0.com) tenant (free tier works)

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env
```

Fill in:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | MongoDB connection string |
| `AUTH0_DOMAIN` | Tenant domain (e.g. `dev-xxx.us.auth0.com`) |
| `AUTH0_CLIENT_ID` | Auth0 application client ID |
| `AUTH0_CLIENT_SECRET` | Auth0 application client secret |
| `AUTH0_SECRET` | Session cookie secret (`openssl rand -hex 32`) |
| `APP_BASE_URL` | `http://localhost:3000` for local dev |
| `AUTH0_AUDIENCE` | Auth0 API identifier (for ChatGPT MCP OAuth) |

3. Auth0 Dashboard:

   - Create a **Regular Web Application**
   - **Allowed Callback URLs:** `http://localhost:3000/auth/callback`
   - **Allowed Logout URLs:** `http://localhost:3000`
   - (Optional) Enable **Google** social login under Authentication → Social
   - Create an **API** with identifier `https://blog-mcp-five.vercel.app/api/mcp` (must match ChatGPT `resource=` and `AUTH0_AUDIENCE`)
   - On that API → **Access Settings** → enable **Allow Offline Access** (refresh tokens for ChatGPT)
   - **Applications** tab on the API → authorize the **ChatGPT** app (`tpc_...`)
   - Enable **OIDC Dynamic Application Registration** (Settings → Advanced)
   - For the ChatGPT app (`tpc_...`): **Settings → Advanced → Grant Types** → enable **Refresh Token**; enable **Refresh Token Rotation** for public clients

4. Push the Prisma schema to MongoDB:

```bash
npm run db:push
```

5. Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Phase 1 flows

- **Sign in** — Home or `/login` → Auth0 (Google social optional in Auth0)
- **Onboarding** — First-time users choose a unique username at `/onboarding`
- **Dashboard** — `/dashboard` shows profile and username; **Sign out** returns to home

## Posts (Phase 2)

### Dashboard routes

| Route | Action |
|-------|--------|
| `/dashboard/posts` | List all your posts |
| `/dashboard/posts/new` | Create post (markdown) |
| `/dashboard/posts/[id]/edit` | Edit or delete post |

### REST API (session cookie — sign in via browser first)

| Method | Path | Action |
|--------|------|--------|
| `GET` | `/api/posts` | List posts |
| `POST` | `/api/posts` | Create post (JSON body) |
| `GET` | `/api/posts/:id` | Get one post |
| `PATCH` | `/api/posts/:id` | Update post |
| `DELETE` | `/api/posts/:id` | Delete post |

Example create body:

```json
{
  "title": "Hello world",
  "content": "# Hi\n\nMarkdown content.",
  "status": "DRAFT",
  "excerpt": "Optional short summary",
  "slug": "optional-custom-slug"
}
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run db:push` | Sync Prisma schema to MongoDB |
| `npm run db:generate` | Regenerate Prisma client |

## MCP (Cursor & other clients)

1. Sign in at [http://localhost:3000](http://localhost:3000)
2. Open **Dashboard → MCP** (`/dashboard/settings`)
3. **Generate API key** and copy it once
4. In your shell:

```bash
export BLOG_MCP_API_KEY=blog_your_key_here
```

5. Use project [`.cursor/mcp.json`](.cursor/mcp.json) or paste the config from the settings page
6. Restart Cursor (Settings → MCP → enable **blog-mcp**)

**Endpoint:** `http://localhost:3000/api/mcp`  
**Auth (Cursor / VS Code):** `Authorization: Bearer <api_key>`  
**Auth (ChatGPT):** OAuth via Auth0 — connect using your production URL; API keys still work for IDE clients

| Tool | Description |
|------|-------------|
| `list_posts` | List your posts (optional `status`, `limit`) |
| `get_post` | Get by `id` or `slug` |
| `create_post` | Create markdown post |
| `update_post` | Update by `id` |
| `delete_post` | Delete by `id` |

## Public blog

Only **Published** posts are visible (drafts stay private).

| URL | Page |
|-----|------|
| `/{username}` | Author portfolio + post list |
| `/{username}/{slug}` | Single published post |

Example: `http://localhost:3000/your-username/my-post-slug`

Set a post to **Published** in the dashboard editor to make it public.

## Roadmap
