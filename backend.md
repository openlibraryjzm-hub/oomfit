# Backend & Database Architecture (`backend.md`)

This document details the backend architecture, database schema, API routing, and data persistence layer for **oomfit**.

---

## 🎯 Architectural Overview

**oomfit** follows a modern, decoupled backend architecture built on **Next.js 16 App Router** and **Supabase (PostgreSQL + Object Storage)**:

```text
┌────────────────────────────────────────────────────────┐
│                   Frontend Client                      │
│     (Home Directory / Catalog View / Thread View)      │
└──────────────────────────┬─────────────────────────────┘
                           │ fetch()
                           ▼
┌────────────────────────────────────────────────────────┐
│           Next.js 16 API Route Handlers                │
│    (/api/boards, /api/threads, /api/bots, etc.)        │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│           Server Store & Agent Service Layer           │
│         (src/lib/server/store.ts & bots.ts)            │
└──────────────────────────┬─────────────────────────────┘
                           │ @supabase/supabase-js
                           ▼
┌────────────────────────────────────────────────────────┐
│              Supabase Cloud Infrastructure             │
│   ├── PostgreSQL DB (boards, threads, replies tables)  │
│   ├── Row-Level Security (RLS) Policies                │
│   └── Storage Bucket ("media" for images & thumbnails) │
└────────────────────────────────────────────────────────┘
```

---

## 🔑 Environment Configuration

Database connectivity requires credentials configured in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[publishable-or-anon-key]
# Optional: Service role key for admin scripts or background worker bypass
SUPABASE_SERVICE_ROLE_KEY=[secret-service-role-key]
```

Client initialization is encapsulated in [`src/lib/supabase.ts`](file:///c:/Users/GGPC/Desktop/oomfit/src/lib/supabase.ts), which dynamically selects between the service role key and anon key depending on execution context.

---

## 🗄️ PostgreSQL Database Schema

The complete database migration script is maintained in [`supabase/schema.sql`](file:///c:/Users/GGPC/Desktop/oomfit/supabase/schema.sql).

### 1. `boards` Table
Stores registered and community-created boards (like subreddits).

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `text` | Primary Key | Board identifier (matches shortcode, e.g. `keeb`) |
| `shortcode` | `text` | Unique, Not Null | URL slug (e.g. `mc`, `v`, `keeb`) |
| `name` | `text` | Not Null | Display name (e.g. *Mechanical Keyboards*) |
| `domain` | `text` | Not Null, Default `'Community'` | Broad cultural domain (`Gaming`, `Technology`, `Aesthetics`) |
| `sub_category` | `text` | Default `'User Created'` | Secondary category classification |
| `description` | `text` | Default `''` | Board purpose and charter |
| `tags` | `text[]` | Default `'{}'` | Search and discovery keywords |
| `created_at` | `timestamptz` | Not Null, Default `now()` | Timestamp of board registration |

### 2. `threads` Table
Stores original post (OP) threads created by users or automated agents.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `bigint` | Primary Key, Identity | Numeric thread identifier |
| `thread_number` | `bigint` | Unique, Not Null | Imageboard post number (e.g. `1000042`) |
| `board_id` | `text` | Foreign Key $\to$ `boards(shortcode)` | Parent board shortcode |
| `title` | `text` | Default `''` | Thread subject / headline |
| `teaser` | `text` | Default `''` | Truncated preview text for catalog display |
| `replies` | `integer` | Default `0` | Cached count of replies |
| `images` | `integer` | Default `0` | Cached count of image attachments |
| `author_id` | `text` | Default `'u_anon'` | User or bot profile identifier |
| `author_name` | `text` | Default `'Anonymous'` | Display username / handle |
| `author_avatar_bg`| `text` | Default Tailwind gradient | CSS gradient for author avatar |
| `author_initials` | `text` | Default `'AN'` | Two-letter avatar monogram |
| `timestamp_label` | `text` | Not Null | Imageboard formatted date `MM/DD/YY(Day)HH:MM` |
| `color_tone` | `text` | Default Tailwind gradient | Thumbnail placeholder color |
| `aspect_ratio` | `jsonb` | Default 16:9 config | Ratio class and dimension specifications |
| `comments` | `text[]` | Default `'{}'` | Array of comment lines (supports greentext `>`) |
| `file_metadata` | `jsonb` | Nullable | File specifications (`name`, `size`, `dimensions`, `url`) |
| `created_at` | `timestamptz` | Not Null, Default `now()` | ISO timestamp |

### 3. `replies` Table
Stores replies linked to a parent thread.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `bigint` | Primary Key, Identity | Sequential reply primary key |
| `post_number` | `bigint` | Unique, Not Null | Unique post number for quoting (`>>No.`) |
| `thread_id` | `bigint` | Foreign Key $\to$ `threads(id)` | Parent thread ID |
| `author_id` | `text` | Default `'u_anon'` | Author user ID |
| `author_name` | `text` | Default `'Anonymous'` | Author username |
| `author_avatar_bg`| `text` | Default Tailwind gradient | Avatar gradient |
| `author_initials` | `text` | Default `'AN'` | Avatar initials |
| `timestamp_label` | `text` | Not Null | Imageboard formatted date |
| `reply_to` | `bigint[]` | Default `'{}'` | Post numbers referenced by this reply |
| `comments` | `text[]` | Default `'{}'` | Array of comment lines |
| `file_metadata` | `jsonb` | Nullable | Optional image attachment metadata |
| `created_at` | `timestamptz` | Not Null, Default `now()` | ISO timestamp |

---

## 🔒 Row-Level Security (RLS) & Storage

* **Public Read Access:** Unauthenticated and authenticated visitors can freely read boards, catalog threads, and reply trees.
* **Public Insert Access:** Visitors can register custom boards, start threads, and submit replies without requiring mandatory login wall restrictions.
* **Storage Bucket (`media`):** Dedicated public bucket for uploaded image files and thumbnails, accessible via public CDN URLs.

---

## 🌐 API Route Handlers

The application exposes standard REST endpoints located in `src/app/api/`:

### 1. `GET /api/boards` & `POST /api/boards`
* **GET:** Returns all active boards (merging database records with default directory seeds).
* **POST:** Creates a new custom board.
  ```json
  {
    "shortcode": "keeb",
    "name": "Mechanical Keyboards",
    "domain": "Technology",
    "subCategory": "Hardware",
    "description": "Custom mechanical keyboards, switches, and keycaps",
    "tags": ["hardware", "switches", "keycaps"]
  }
  ```

### 2. `GET /api/threads?b=[shortcode]` & `POST /api/threads`
* **GET:** Returns all threads under a board. Returns an empty array `[]` if no threads have been created, triggering the authentic empty board state in the UI.
* **POST:** Creates an Original Post (OP) thread under `boardId`.

### 3. `GET /api/threads/[id]`
* Returns `{ op: Thread, replies: ThreadReply[] }`. Returns `404` if the thread does not exist.

### 4. `POST /api/threads/[id]/replies`
* Appends a reply to thread `[id]`. Parses quotes (`>>No.`) into the `replyTo` array and increments the thread reply counter.

### 5. `POST /api/bots`
* Endpoint for automated poster agents to generate on-topic discussions:
  ```json
  // Generate a new thread
  { "action": "thread", "boardId": "mc" }

  // Generate a reply to an existing thread
  { "action": "reply", "threadId": 1001 }
  ```

---

## 🤖 Automated Bot Poster Engine (`src/lib/server/bots.ts`)

To solve the **cold-start dilemma** (where fresh niche boards appear empty and deter organic engagement), **oomfit** includes a native agentic bot engine:

* **Distinct Personas:** Multiple simulated accounts (`GlitchPoet`, `CircuitWeaver`, `PixelHermit`, `SynthDrifter`, `NullPointer`) with unique avatar colors, initials, and posting styles.
* **Contextual Thread Generation:** Generates board-appropriate thread titles, opening remarks, and greentext anecdotes derived from the board's name, description, and tags.
* **Backlink Quoting:** When generating replies, bots automatically target earlier post numbers (`>>No.`), trigger recursive inlining, and simulate authentic imageboard banter.
* **One-Click Testing:** UI triggers (`[Bot Seed]` in catalog view and `[Bot Reply]` in thread view) allow instant population during development and community seeding.

---

## 🚀 Scaling & Production Roadmap

When scaling beyond prototype traffic, implement the following database enhancements:

### 1. Catalog Pagination & Range Cursors
Replace unbounded thread fetching with offset or keyset pagination:
```ts
// src/lib/server/store.ts
const { data } = await supabase
  .from("threads")
  .select("*")
  .eq("board_id", boardCode)
  .order("last_bumped_at", { ascending: false })
  .range(page * 50, (page + 1) * 50 - 1);
```

### 2. Atomic Bump Trigger & Concurrency
Ensure thread bumps and reply counts never encounter JavaScript race conditions by offloading increments to a PostgreSQL trigger:
```sql
create or replace function bump_thread_on_reply() returns trigger as $$
begin
  update public.threads 
  set replies = replies + 1,
      last_bumped_at = now()
  where id = new.thread_id;
  return new;
end;
$$ language plpgsql;

create trigger tr_bump_thread
after insert on public.replies
for each row execute function bump_thread_on_reply();
```

### 3. PostgreSQL Sequence for Post Numbers
Replace randomized timestamp formulas with a thread-safe monotonic sequence:
```sql
create sequence if not exists post_number_seq start with 1000000;
alter table public.threads alter column thread_number set default nextval('post_number_seq');
alter table public.replies alter column post_number set default nextval('post_number_seq');
```

### 4. High-Performance Composite Indexes
Add composite indexes for sub-5ms queries on heavy tables:
```sql
create index if not exists idx_threads_board_bump on public.threads(board_id, created_at desc);
create index if not exists idx_replies_thread_id on public.replies(thread_id, id asc);
create index if not exists idx_boards_shortcode on public.boards(shortcode);
```

### 5. Media Thumbnail Optimization
Store a compressed 200px WebP thumbnail alongside full-resolution uploads. The catalog skimmer only requests the thumbnail, saving up to 95% of bandwidth and preserving storage limits.
