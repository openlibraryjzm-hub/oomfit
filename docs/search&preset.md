# Search & Preset Engine Documentation (`search&preset.md`)

This document details the **Dual Search & Dynamic Preset Engine** powering the directory on the home page (`src/app/page.tsx`) and defined in `src/lib/boards.ts`.

---

## 🔌 Multi-Source Board Indexing

The search engine operates over both built-in seed boards and user-created boards:
* **Built-in Boards (105):** Core registered boards categorized into curated presets (`src/lib/boards.ts`).
* **Community Boards (Live Supabase):** Real-time boards created by visitors via the `boards` database table, seamlessly incorporated into generic search scoring and deduplicated.
* **Direct Routing:** All matched boards route to `/catalog?b=[shortcode]`, rendering their live threads from the database.

---

## 🎯 Architecture Overview

A core dilemma of scaling an imageboard directory is avoiding the **taxonomy bottleneck**:
* If boards require rigid multi-category trees, board creation becomes bureaucratic and categories fragment endlessly.
* If generic search strips away categories into a flat list, the authentic imageboard directory look is lost.

To solve this, **oomfit** employs a **Dual Search Model**:

```text
User Input in Search Bar:
├── Starts with "/" ──► Preset Command Mode (Curated Lenses)
│                       - Loads hand-crafted, structured category columns
│                       - e.g. "/gaming", "/anime", "/retro", "/music"
│
└── No "/" prefix  ──► Generic Search Mode (Linguistic Discovery + Domain Clustering)
                        - Scores all 105 boards by linguistic relevance & typo tolerance
                        - Dynamically clusters results by cultural Domain into clean columns
```

---

## ⚡ Mode 1: Curated Presets (`/` Commands)

Presets represent curated, structured snapshots of the board ecosystem. They provide users with clean, categorized starting points without requiring manual searching.

### Predefined System Presets

| Command | Name | Aliases | Categories & Focus |
|---|---|---|---|
| `/default` | **Default** | `home`, `main` | Balanced overview: Games, Technology, Aesthetics, Culture |
| `/gaming` | **Gaming** | `games`, `v` | Consoles, Hit Titles, Genres, Handhelds & Mods |
| `/consoles` | **Consoles** | `console`, `crt` | Sony PlayStation, Nintendo Heritage, Sega/Arcade, CRT & Emulation |
| `/retro` | **Retro** | `nostalgia`, `vr` | Retro Games, Pre-HD Consoles, Vintage Computing, Retro Aesthetics |
| `/tech` | **Tech & Dev** | `dev`, `code`, `g` | AI & Agents, Software & Systems, Hardware & Maker, Science & Space |
| `/ai` | **AI & Agents** | `agents`, `vibe` | Models & Weights, Agentic Dev & Flow, Generative Media, Homelab |
| `/aesthetics`| **Aesthetics** | `art`, `aes` | Visual Vibes, Digital Illustration, Anime & Manga, Design & Analog |
| `/anime` | **Anime & Otaku**| `manga`, `weeb`, `a` | Anime & Manga, Virtual & Fanart, Otaku Subcultures, Rhythm |
| `/music` | **Music & Audio**| `audio`, `sound` | Genres & Sound, Audiophile Gear, OSTs & Chiptune, Listening Spaces |
| `/culinary` | **Food & Sips** | `food`, `cook` | Kitchen Cooking, Specialty Coffee & Tea, Fermentation, Cozy Living |
| `/maker` | **Maker & Crafts** | `hobbies`, `diy` | Woodworking & 3D Printing, Watches & Pens, Tabletop Warhammer/RPG |
| `/media` | **Books & Cinema** | `books`, `lit` | Literature & Lore, Film & Screenings, Speculative Worlds, Nooks |

### Preset Command Resolution
When an input starts with `/` (e.g. `/ret` or `/retro`):
1. **Exact & Alias Match:** Matches against preset `command`, `id`, or `aliases`.
2. **Prefix Match:** Typing `/ga` resolves directly to `/gaming`; `/an` resolves to `/anime`.
3. **Typo Tolerance:** Uses Levenshtein distance $\le 2$ on preset names (e.g. `/amime` resolves to `/anime`).

---

## 🔍 Mode 2: Generic Search & Domain Clustering

When the search input has **no `/` prefix**, it executes a universal keyword search across all registered boards.

### 1. Linguistic Specificity Scoring (Solution 1)
To ensure relevance without relying on artificial bot post rates or popularity manipulation, boards are scored purely by linguistic affinity:

| Match Type | Weight | Example Query | Target Board | Score |
|---|---|---|---|---|
| **Exact Shortcode** | $+150$ | `mc` | `/mc/` | 150 |
| **Exact Title Match** | $+120$ | `minecraft` | `/mc/` Minecraft | 120 |
| **Title Word Match** | $+90$ | `gaming` | `/v/` Video Games, `/vr/` Retro Gaming | 90 |
| **Domain Exact Match** | $+55$ | `music` | Boards in Music domain | 55 |
| **Tag Exact Match** | $+45$ | `fromsoft` | `/souls/` Elden Ring | 45 |
| **Title Substring** | $+50$ | `craft` | `/mc/` Minecraft, `/wood/` Woodcraft | 50 |
| **Tag Substring** | $+25$ | `rogue` | `/rogue/` Roguelikes | 25 |
| **Typo (Levenshtein $\le 2$)** | $+18 \text{ to } +32$ | `eldren` | `/souls/` Elden Ring | 32 |

### 2. "Let the Chips Fall Where They May" (Solution 3)
- No artificial algorithms hide obscure boards or boost mainstream titles artificially.
- If an obscure indie board matches the search term, it sits alongside popular titles strictly based on textual relevance. This preserves the serendipitous discovery essential to authentic imageboards.

### 3. Domain-Level Category Clustering (Remedy 1)
To prevent search results from degrading into an unstyled flat list, generic search results are **automatically clustered into clean category columns**:

1. **Multi-Domain Matches (e.g. searching `"retro"`, `"art"`, `"space"`):**
   - Matching boards are grouped by their broad cultural `domain` (`GAMING`, `TECHNOLOGY`, `AESTHETICS`, `MUSIC`).
   - Each domain forms a classic vertical column with an underlined header.
2. **Single-Domain Matches (e.g. searching `"shooter"` or `"nintendo"`):**
   - If all matches belong to the same parent domain, the engine sub-clusters by secondary `subCategory` (`HIT TITLES`, `GENRES`, `CONSOLES`) to maintain the multi-column visual rhythm.
3. **Single-Cluster Fallback:**
   - If only one narrow niche matches, the engine splits results into balanced columns under the domain title.

---

## 🚀 Future Scalability: The Community Playlist Model

In production with thousands of user-created boards:
1. **Flat Board Creation:** Creators create boards with zero taxonomy bureaucracy (Name + Shortcode + 3 tags).
2. **Community Presets:** Users can curate custom presets (like Spotify playlists or Steam curators) and publish them under slash commands (e.g. `/boomershooters`, `/cozyindie`).
3. **Popularity Multiplier:** Once genuine organic traffic arrives, real post velocity can gently influence tie-breakers, without needing to ration bot activities during cold start.
