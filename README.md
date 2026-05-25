# Blog MCP

Phased blogging platform with MCP authoring for Cursor. **Phase 1** includes Google sign-in, username onboarding, and logout.

## Prerequisites

- Node.js 20+
- MongoDB Atlas cluster (or local MongoDB)
- Google OAuth credentials

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
| `AUTH_SECRET` | Random secret (`openssl rand -base64 32`) |
| `AUTH_GOOGLE_ID` | Google OAuth client ID |
| `AUTH_GOOGLE_SECRET` | Google OAuth client secret |
| `AUTH_URL` / `NEXTAUTH_URL` | `http://localhost:3000` for local dev |

3. Google Cloud Console → **APIs & Services → Credentials** → OAuth 2.0 Client ID (Web):

   - Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

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

- **Sign in** — Home or `/login` → Google OAuth
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

## Roadmap

- **Phase 2** — Post CRUD in dashboard
- **Phase 3** — Public portfolio at `/{username}`
- **Phase 4** — API keys + MCP endpoint for Cursor
