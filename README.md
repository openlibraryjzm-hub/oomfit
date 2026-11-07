# oomfit

**oomfit** is a modern, SFW (Safe For Work), non-hateful imageboard inspired by classic imageboards (4chan), reimagined with an **account-based community model** and **user-created boards** (similar to subreddits).

---

## 🌟 Project Vision

- **Imageboard Speed & Density:** The beloved, fast, dense visual browsing experience of an imageboard (catalog view, fast image expansion, direct thread quoting).
- **SFW & Wholesome Culture:** Strict focus on constructive community topics (fitness, wellness, nutrition, routines, lifestyle) without hateful content.
- **Account-Based Identity:** Real user accounts and avatars replacing raw anonymous number feeds, while preserving imageboard brevity and conversational flow.
- **Custom Boards (Like Subreddits):** Users will be able to create, curate, and moderate their own niche boards.

> **Note on Current Stage (Heavy Placeholders):**  
> The project is currently in the frontend architecture and UI prototype phase. The catalog (150 threads), user accounts, avatars, image attachments, aspect ratios, and reply chains are powered by structured mock data generators in `src/lib/data.ts`. Backend persistence, auth, and database models will be connected in subsequent phases.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) 16 (App Router, Turbopack, Partial Prerendering)
- **UI Library:** [React](https://react.dev/) 19 (Hooks, `Suspense`, `use()` async unwrap)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) v4 (`@import "tailwindcss"`)
- **Language:** TypeScript 5
- **Icons:** [Lucide React](https://lucide.dev/) + Custom SVG brand marks

---

## 🚀 Quickstart for Agents & Developers

### 1. Install & Run Dev Server

```bash
npm install
npm run dev
```

The application runs locally on **[http://localhost:3000](http://localhost:3000)**.

### 2. Verify Production Build & Typecheck

```bash
npm run build
```

Always run `npm run build` to verify type safety and catch Next.js SSR/prerender boundaries.

---

## 📂 Project Structure

```text
oomfit/
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root HTML layout & fonts
│   │   ├── globals.css        # Global Tailwind v4 styles
│   │   ├── page.tsx           # 4chan-style Home Page (Early-2000s Directory & Dual Search)
│   │   ├── catalog/
│   │   │   └── page.tsx       # Catalog view (Visual thread skimmer, ?b=board)
│   │   ├── thread/
│   │   │   └── [id]/
│   │   │       └── page.tsx   # Thread view (4chan X style inlining)
│   │   └── api/               # Next.js 16 REST Route Handlers
│   │       ├── boards/        # GET all boards, POST custom boards
│   │       ├── threads/       # GET threads by board, POST new thread
│   │       │   └── [id]/      # GET thread by id, POST replies
│   │       └── bots/          # Cold-start automated agent poster engine
│   └── lib/
│       ├── boards.ts          # 105 registered boards, 12 presets & dual search engine
│       ├── client-api.ts      # Client-side API fetch wrapper
│       ├── data.ts            # User accounts, aspect ratios & color palettes
│       ├── supabase.ts        # Supabase client initialization
│       └── server/            # Server-only persistence & agent logic
│           ├── store.ts       # Database access layer (Supabase PostgreSQL)
│           └── bots.ts        # Contextual bot personas & seed generators
├── supabase/
│   └── schema.sql             # PostgreSQL tables (boards, threads, replies, RLS, storage)
├── backend.md                 # Complete documentation of database schema & API layer
├── home.md                    # Detailed documentation of the Home Page system
├── search&preset.md           # Detailed documentation of the Dual Search & Presets
├── boards.md                  # Brainstorm master catalog of 160+ boards
├── catalog.md                 # Detailed documentation of the Catalog system
├── thread.md                  # Detailed documentation of the Thread system
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🤖 Onboarding Notes for Fresh Agents

1. **Next.js 16 App Router Dynamic Route Conventions:**
   - In Next.js 16, route parameters (`params`) in client components must be unwrapped using React's `use(params)` inside a `<Suspense>` boundary. Never read raw route hooks outside of suspense.
   - Any client components calling `useSearchParams()` must also be wrapped in a `<Suspense>` boundary.
   - Dynamic route handlers in `src/app/api/...` must unwrap params via `const { id } = await params;`.
2. **Stable Component Identity for Inlining:**
   - On the thread page, `<PostCard>` is declared at the module level (outside `ThreadContent`). This is critical: if declared inside the parent component, hover preview updates cause component remounts, wiping out inlined cards.
3. **Database & Data Persistence:**
   - The application connects to **Supabase PostgreSQL** via `src/lib/server/store.ts` and `src/lib/supabase.ts`.
   - The database stores custom boards, threads, replies, and file metadata.
   - Boards start completely empty by default until real users or bots post discussions.
4. **Cold-Start Bot Posters:**
   - An agentic bot generator in `src/lib/server/bots.ts` provides contextual threads and replies on demand (`[Bot Seed]` in catalog, `[Bot Reply]` in threads) to simulate active communities during cold start.
5. **Available Themes:**
   - **Classic (Default for Home):** Authentic Yotsuba beige imageboard palette (`#FFFFEE` canvas, `#F0E0D6` bars, maroon `#800000`, navy `#0F0C5D`, hover red `#D00`).
   - **Twitter:** Modern cool palette (`#E6ECF0` canvas, `#FFFFFF` cards, `#1DA1F2` blue accents).
   - **Light:** Clean modern slate palette.

---

## 📖 Feature Documentation

For in-depth explanations of specific subsystems, consult the dedicated guides:

- 🗄️ [**Backend Documentation (backend.md)**](./backend.md) — Supabase PostgreSQL schema, API routes, bot poster engine, and scaling roadmap.
- 🏠 [**Home Page Documentation (home.md)**](./home.md) — Early-2000s 4chan-style directory layout, compact centered box, bracketed navigation, custom board modal, and directory themes.
- ⚡ [**Search & Preset Documentation (search&preset.md)**](./search&preset.md) — Dual search engine (`/` prefix for curated presets, linguistic specificity + domain clustering for generic search, user board inclusion).
- 📋 [**Catalog Documentation (catalog.md)**](./catalog.md) — Grid reflow, zoom tolerance (67% - 150%), realistic aspect ratios, authentic empty board view, and live filtering across boards.
- 💬 [**Thread Documentation (thread.md)**](./thread.md) — 4chan X quote hover previews, recursive inlining above image/text, live reply posting, and bot reply simulation.
- 📚 [**Boards Reference (boards.md)**](./boards.md) — Master brainstorm list of 160+ boards across gaming, tech, aesthetics, anime, music, culinary, crafts, and literature.
