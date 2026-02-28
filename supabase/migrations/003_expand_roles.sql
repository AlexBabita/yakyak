-- Allow expanded roles on conversations (agent, bot, customer, stakeholder, finance, legal, support, marketing, executive).
-- Run in Supabase Dashboard → SQL Editor after 001 and 002.

alter table public.conversations
  drop constraint if exists conversations_from_role_check,
  drop constraint if exists conversations_to_role_check;

alter table public.conversations
  add constraint conversations_from_role_check check (
    from_role in (
      'developer', 'project-manager', 'qa', 'designer',
      'agent', 'bot', 'customer', 'stakeholder', 'finance-team',
      'legal', 'support', 'marketing', 'executive'
    )
  ),
  add constraint conversations_to_role_check check (
    to_role in (
      'developer', 'project-manager', 'qa', 'designer',
      'agent', 'bot', 'customer', 'stakeholder', 'finance-team',
      'legal', 'support', 'marketing', 'executive'
    )
  );
