-- ========================================================
-- OOMFIT SUPABASE DATABASE SCHEMA
-- Run this in your Supabase Dashboard: SQL Editor -> New Query -> Run
-- ========================================================

-- 1. BOARDS TABLE
create table if not exists public.boards (
  id text primary key,
  shortcode text unique not null,
  name text not null,
  domain text not null default 'Community',
  sub_category text default 'User Created',
  description text default '',
  tags text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. THREADS TABLE
create table if not exists public.threads (
  id bigint generated always as identity primary key,
  thread_number bigint unique not null,
  board_id text not null references public.boards(shortcode) on delete cascade,
  title text default '',
  teaser text default '',
  replies integer default 0,
  images integer default 0,
  author_id text default 'u_anon',
  author_name text default 'Anonymous',
  author_avatar_bg text default 'from-blue-600 to-indigo-800',
  author_initials text default 'AN',
  timestamp_label text not null,
  color_tone text default 'from-slate-700 to-zinc-900',
  aspect_ratio jsonb default '{"ratioClass": "aspect-[16/9] w-full max-h-[140px]", "dimLabel": "1920x1080 (16:9)"}'::jsonb,
  comments text[] default '{}',
  file_metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. REPLIES TABLE
create table if not exists public.replies (
  id bigint generated always as identity primary key,
  post_number bigint unique not null,
  thread_id bigint not null references public.threads(id) on delete cascade,
  author_id text default 'u_anon',
  author_name text default 'Anonymous',
  author_avatar_bg text default 'from-blue-600 to-indigo-800',
  author_initials text default 'AN',
  timestamp_label text not null,
  reply_to bigint[] default '{}',
  comments text[] default '{}',
  file_metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- Allow everyone to read boards, threads, and replies
alter table public.boards enable row level security;
alter table public.threads enable row level security;
alter table public.replies enable row level security;

-- Clean existing policies if re-running
drop policy if exists "Allow public read on boards" on public.boards;
drop policy if exists "Allow public insert on boards" on public.boards;
drop policy if exists "Allow public read on threads" on public.threads;
drop policy if exists "Allow public insert on threads" on public.threads;
drop policy if exists "Allow public update on threads" on public.threads;
drop policy if exists "Allow public read on replies" on public.replies;
drop policy if exists "Allow public insert on replies" on public.replies;

-- Policies for boards
create policy "Allow public read on boards" on public.boards for select using (true);
create policy "Allow public insert on boards" on public.boards for insert with check (true);

-- Policies for threads
create policy "Allow public read on threads" on public.threads for select using (true);
create policy "Allow public insert on threads" on public.threads for insert with check (true);
create policy "Allow public update on threads" on public.threads for update using (true);

-- Policies for replies
create policy "Allow public read on replies" on public.replies for select using (true);
create policy "Allow public insert on replies" on public.replies for insert with check (true);

-- 5. STORAGE BUCKET FOR MEDIA
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

-- Storage bucket public policies
drop policy if exists "Public media bucket read" on storage.objects;
drop policy if exists "Public media bucket insert" on storage.objects;

create policy "Public media bucket read" on storage.objects for select using (bucket_id = 'media');
create policy "Public media bucket insert" on storage.objects for insert with check (bucket_id = 'media');
