-- Stop restricting from_role / to_role to a fixed list. The app (translator-options.ts) is the single source of truth for roles.
-- This way you can add new roles in the app without running a DB migration.

alter table public.conversations
  drop constraint if exists conversations_from_role_check,
  drop constraint if exists conversations_to_role_check;
