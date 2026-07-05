create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  plan text default 'free',
  stripe_customer_id text,
  created_at timestamptz default now()
);

create table if not exists public.projects (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  idea text not null,
  audience text,
  problem text,
  created_at timestamptz default now()
);

create table if not exists public.reports (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  title text not null,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz default now()
);

create table if not exists public.billing_events (
  id uuid primary key default uuid_generate_v4(),
  stripe_event_id text unique,
  event_type text not null,
  customer_id text,
  subscription_id text,
  checkout_session_id text,
  plan text,
  status text,
  raw jsonb not null,
  created_at timestamptz default now()
);

create table if not exists public.research_runs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  model text,
  result jsonb not null,
  created_at timestamptz default now()
);

create table if not exists public.analyses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  kind text not null,
  model text,
  result jsonb not null,
  created_at timestamptz default now()
);

create table if not exists public.watchlist_items (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  label text not null,
  url text,
  note text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.reports enable row level security;
alter table public.billing_events enable row level security;
alter table public.research_runs enable row level security;

create policy "Users can read own profile"
on public.profiles for select
using (auth.uid() = id);

create policy "Users can update own profile"
on public.profiles for update
using (auth.uid() = id);

create policy "Users can manage own projects"
on public.projects for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can manage own reports"
on public.reports for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can manage own research runs"
on public.research_runs for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

alter table public.analyses enable row level security;

create policy "Users can manage own analyses"
on public.analyses for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

alter table public.watchlist_items enable row level security;

create policy "Users can manage own watchlist"
on public.watchlist_items for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
