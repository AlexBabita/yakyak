-- Auto-create a profile row when a new user signs up (Supabase Auth).
-- Run this in Supabase Dashboard → SQL Editor after 001_initial_schema.sql.
-- Requires: public.profiles and public.handle_new_user() from 001.

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
