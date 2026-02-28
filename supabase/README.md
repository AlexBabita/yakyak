# Supabase schema for YakYak

## Run the migrations

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → your project.
2. Go to **SQL Editor** → **New query**.
3. Run in order:
   - Copy `migrations/001_initial_schema.sql` → paste → **Run**.
   - Copy `migrations/002_enable_profile_on_signup.sql` → paste → **Run**.
   - Copy `migrations/003_expand_roles.sql` → paste → **Run** (expands From/To roles).
   - Copy `migrations/004_roles_allow_any.sql` → paste → **Run** (optional: lets you add new roles in the app only, no more DB migrations for roles).

`001` creates the tables; `002` enables auto-creation of a profile row when a user signs up.

This creates:

| Table          | Purpose |
|----------------|--------|
| `profiles`     | Optional; extends Supabase Auth (display name, avatar). Enable the trigger in the migration to auto-create a row when a user signs up. |
| `conversations`| One row per translator chat (from/to role and language). |
| `messages`     | Each user/assistant message in a conversation. |

RLS is enabled so users can only read/write their own profiles, conversations, and messages.

## Optional: allow anonymous conversations

If you want unauthenticated users to create conversations (e.g. before login), in the SQL file uncomment the two policies under “Allow anonymous inserts” and ensure `conversations.user_id` is nullable (it already is: no `not null` on `user_id`). Your app would then insert with `user_id: null` and later update to `auth.uid()` when the user signs in.
