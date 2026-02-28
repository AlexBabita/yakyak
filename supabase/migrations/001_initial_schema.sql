-- YakYak initial schema: profiles, conversations, messages.
-- Run this in Supabase Dashboard → SQL Editor (New query) → paste & Run.

-- =============================================================================
-- 1. Profiles (optional; links to Supabase Auth)
-- =============================================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Trigger to create profile on signup (optional; enable if using Supabase Auth)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.raw_user_meta_data->>'email',
    coalesce(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

-- Uncomment to auto-create profile when a user signs up:
-- drop trigger if exists on_auth_user_created on auth.users;
-- create trigger on_auth_user_created
--   after insert on auth.users
--   for each row execute function public.handle_new_user();

-- =============================================================================
-- 2. Conversations (one per translator chat session)
-- =============================================================================
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade,
  from_role text not null default 'developer' check (from_role in ('developer', 'project-manager', 'qa', 'designer')),
  to_role text not null default 'project-manager' check (to_role in ('developer', 'project-manager', 'qa', 'designer')),
  from_lang text default '__auto__',
  to_lang text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_conversations_user_id on public.conversations (user_id);
create index if not exists idx_conversations_created_at on public.conversations (created_at desc);

-- =============================================================================
-- 3. Messages (user + assistant messages in a conversation)
-- =============================================================================
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_messages_conversation_id on public.messages (conversation_id);
create index if not exists idx_messages_created_at on public.messages (conversation_id, created_at);

-- =============================================================================
-- 4. Row Level Security (RLS)
-- =============================================================================
alter table public.profiles enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;

-- Profiles: users can read/update own row
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Conversations: users can do everything for their own rows; allow anon to insert (optional)
create policy "Users can view own conversations"
  on public.conversations for select
  using (auth.uid() = user_id);

create policy "Users can insert own conversations"
  on public.conversations for insert
  with check (auth.uid() = user_id);

create policy "Users can update own conversations"
  on public.conversations for update
  using (auth.uid() = user_id);

create policy "Users can delete own conversations"
  on public.conversations for delete
  using (auth.uid() = user_id);

-- Allow anonymous inserts (conversations without user_id) so app works before login
-- Uncomment if you want unauthenticated users to create conversations:
-- create policy "Allow anon to insert conversations"
--   on public.conversations for insert
--   with check (true);
-- create policy "Allow anon to view conversations by session"
--   on public.conversations for select
--   using (user_id is null);  -- or tie to a session cookie; for now we require user_id for select

-- Messages: only through conversation ownership
create policy "Users can view messages of own conversations"
  on public.messages for select
  using (
    exists (
      select 1 from public.conversations c
      where c.id = messages.conversation_id and c.user_id = auth.uid()
    )
  );

create policy "Users can insert messages in own conversations"
  on public.messages for insert
  with check (
    exists (
      select 1 from public.conversations c
      where c.id = messages.conversation_id and c.user_id = auth.uid()
    )
  );

create policy "Users can delete messages in own conversations"
  on public.messages for delete
  using (
    exists (
      select 1 from public.conversations c
      where c.id = messages.conversation_id and c.user_id = auth.uid()
    )
  );

-- =============================================================================
-- 5. updated_at trigger (optional)
-- =============================================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger set_conversations_updated_at
  before update on public.conversations
  for each row execute function public.set_updated_at();
