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

-- Monitoring state for watchlist URLs (populated by the scheduled monitor job).
alter table public.watchlist_items add column if not exists last_hash text;
alter table public.watchlist_items add column if not exists last_checked_at timestamptz;

create table if not exists public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  title text not null,
  body text,
  url text,
  read boolean not null default false,
  created_at timestamptz default now()
);

-- Public share token for read-only report links (looked up server-side only).
alter table public.reports add column if not exists share_token text;
create unique index if not exists reports_share_token_key on public.reports (share_token);

create table if not exists public.contact_messages (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz default now()
);

-- Team sharing: project owners invite collaborators by email (viewer access).
create table if not exists public.project_members (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.projects(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  member_email text not null,
  role text not null default 'viewer',
  created_at timestamptz default now(),
  unique (project_id, member_email)
);

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.reports enable row level security;
alter table public.billing_events enable row level security;
alter table public.research_runs enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
on public.profiles for select
using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
on public.profiles for insert
with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles for update
using (auth.uid() = id);

-- Projects: owners have full control; invited members get read access.
drop policy if exists "Users can manage own projects" on public.projects;
drop policy if exists "Projects visible to owner and members" on public.projects;
create policy "Projects visible to owner and members"
on public.projects for select
using (
  auth.uid() = user_id
  or exists (
    select 1 from public.project_members pm
    where pm.project_id = projects.id
      and pm.member_email = lower(coalesce(auth.jwt() ->> 'email', ''))
  )
);

drop policy if exists "Owners insert projects" on public.projects;
create policy "Owners insert projects"
on public.projects for insert
with check (auth.uid() = user_id);

drop policy if exists "Owners update projects" on public.projects;
create policy "Owners update projects"
on public.projects for update
using (auth.uid() = user_id);

drop policy if exists "Owners delete projects" on public.projects;
create policy "Owners delete projects"
on public.projects for delete
using (auth.uid() = user_id);

drop policy if exists "Users can manage own reports" on public.reports;
create policy "Users can manage own reports"
on public.reports for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Research runs: owner full control; project members can read.
drop policy if exists "Users can manage own research runs" on public.research_runs;
drop policy if exists "Research visible to owner and members" on public.research_runs;
create policy "Research visible to owner and members"
on public.research_runs for select
using (
  auth.uid() = user_id
  or exists (
    select 1 from public.project_members pm
    where pm.project_id = research_runs.project_id
      and pm.member_email = lower(coalesce(auth.jwt() ->> 'email', ''))
  )
);
drop policy if exists "Owners write research" on public.research_runs;
create policy "Owners write research"
on public.research_runs for insert
with check (
  auth.uid() = user_id
  and exists (
    select 1 from public.projects p
    where p.id = research_runs.project_id and p.user_id = auth.uid()
  )
);
drop policy if exists "Owners delete research" on public.research_runs;
create policy "Owners delete research"
on public.research_runs for delete
using (auth.uid() = user_id);

alter table public.analyses enable row level security;

-- Analyses: owner full control; project members can read.
drop policy if exists "Users can manage own analyses" on public.analyses;
drop policy if exists "Analyses visible to owner and members" on public.analyses;
create policy "Analyses visible to owner and members"
on public.analyses for select
using (
  auth.uid() = user_id
  or exists (
    select 1 from public.project_members pm
    where pm.project_id = analyses.project_id
      and pm.member_email = lower(coalesce(auth.jwt() ->> 'email', ''))
  )
);
drop policy if exists "Owners write analyses" on public.analyses;
create policy "Owners write analyses"
on public.analyses for insert
with check (
  auth.uid() = user_id
  and exists (
    select 1 from public.projects p
    where p.id = analyses.project_id and p.user_id = auth.uid()
  )
);
drop policy if exists "Owners delete analyses" on public.analyses;
create policy "Owners delete analyses"
on public.analyses for delete
using (auth.uid() = user_id);

alter table public.watchlist_items enable row level security;

-- Watchlist: owner full control; project members can read.
drop policy if exists "Users can manage own watchlist" on public.watchlist_items;
drop policy if exists "Watchlist visible to owner and members" on public.watchlist_items;
create policy "Watchlist visible to owner and members"
on public.watchlist_items for select
using (
  auth.uid() = user_id
  or exists (
    select 1 from public.project_members pm
    where pm.project_id = watchlist_items.project_id
      and pm.member_email = lower(coalesce(auth.jwt() ->> 'email', ''))
  )
);
drop policy if exists "Owners write watchlist" on public.watchlist_items;
create policy "Owners write watchlist"
on public.watchlist_items for insert
with check (
  auth.uid() = user_id
  and exists (
    select 1 from public.projects p
    where p.id = watchlist_items.project_id and p.user_id = auth.uid()
  )
);
drop policy if exists "Owners update watchlist" on public.watchlist_items;
create policy "Owners update watchlist"
on public.watchlist_items for update
using (auth.uid() = user_id);
drop policy if exists "Owners delete watchlist" on public.watchlist_items;
create policy "Owners delete watchlist"
on public.watchlist_items for delete
using (auth.uid() = user_id);

alter table public.notifications enable row level security;

drop policy if exists "Users can manage own notifications" on public.notifications;
create policy "Users can manage own notifications"
on public.notifications for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

alter table public.contact_messages enable row level security;

-- Anyone can submit a contact message; only the service role can read them.
drop policy if exists "Anyone can submit a contact message" on public.contact_messages;
create policy "Anyone can submit a contact message"
on public.contact_messages for insert
with check (true);

alter table public.project_members enable row level security;

-- Owners fully manage members of their projects. No reference to the projects
-- table here (prevents policy recursion) — ownership is denormalized as owner_id.
drop policy if exists "Owners manage project members" on public.project_members;
create policy "Owners manage project members"
on public.project_members for all
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

drop policy if exists "Members can see their memberships" on public.project_members;
create policy "Members can see their memberships"
on public.project_members for select
using (member_email = lower(coalesce(auth.jwt() ->> 'email', '')));
