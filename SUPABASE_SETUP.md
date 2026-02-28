# Supabase setup for YakYak backend & DB

## What you need from Supabase

| What | Where to get it | Used for |
|------|-----------------|----------|
| **Project URL** | Dashboard → **Settings** → **API** → Project URL | Base URL for all API/DB requests |
| **anon key** | Dashboard → **Settings** → **API** → `anon` `public` | Client-side app (browser); safe to expose, protected by RLS |
| **service_role key** (optional) | Dashboard → **Settings** → **API** → `service_role` (secret) | Server-only (API routes, cron); never use in frontend |

## Steps

1. **Create a Supabase project**  
   Go to [supabase.com](https://supabase.com) → sign in → **New project** (choose org, name, DB password, region).

2. **Copy URL and keys**  
   In the project: **Settings** (sidebar) → **API**. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon** key (under “Project API keys”) → `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
   If you need server-side admin access later: copy **service_role** → `SUPABASE_SERVICE_ROLE_KEY` (env only, never in client).

3. **Create env file**  
   In the project root:
   ```bash
   cp .env.example .env.local
   ```
   Paste the values into `.env.local`. Do not commit `.env.local`.

4. **Database & Auth**  
   In Supabase:
   - **Table Editor** – create tables (e.g. users, conversations, messages).
   - **Authentication** – enable Email, OAuth, etc. if you use Supabase Auth.
   - **Policies** – define Row Level Security (RLS) so the anon key only accesses what you allow.

That’s all you need for frontend ↔ Supabase backend & DB. Once `.env.local` has `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`, we can wire the app to Supabase (client + optional API routes).
