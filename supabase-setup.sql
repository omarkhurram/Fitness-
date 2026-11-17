-- Run once in Supabase → SQL Editor.
create table if not exists public.training_hq_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.training_hq_data enable row level security;
drop policy if exists "Users can read their own Training HQ data" on public.training_hq_data;
create policy "Users can read their own Training HQ data" on public.training_hq_data
 for select to authenticated using (auth.uid() = user_id);
drop policy if exists "Users can insert their own Training HQ data" on public.training_hq_data;
create policy "Users can insert their own Training HQ data" on public.training_hq_data
 for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "Users can update their own Training HQ data" on public.training_hq_data;
create policy "Users can update their own Training HQ data" on public.training_hq_data
 for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
grant select, insert, update on public.training_hq_data to authenticated;
