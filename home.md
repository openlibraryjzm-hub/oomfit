# Home Page Documentation (`home.md`)

This document provides a comprehensive overview of the **Home Page Directory View** implemented in `src/app/page.tsx`.

---

## ⚠️ Early Development & Heavy Placeholder Status

> [!NOTE]
> **Prototype Stage Notice:**  
> The home page is currently part of the frontend prototype phase. While the directory actively indexes over **100+ registered boards**, all board hyperlinks currently route to the unified placeholder catalog (`/catalog?b=[shortcode]`), displaying dynamically parameterized board headers alongside mock threads. Backend persistence, board creation pipelines, and automated agent populations will be introduced in future phases.

---

## 🎯 Purpose & Design Philosophy

The home page acts as the primary navigational front door of **oomfit**. It is designed as an authentic homage to classic early-2000s imageboards (specifically `4chan.org`), prioritizing:

1. **Extreme Information Density & Clarity:** Pure text hyperlinks, zero distracting thumbnails, zero marketing fluff, and zero promotional banners.
2. **Distinct Category Hierarchy:** Boards organized into clean, vertical columns separated by bold, uppercase, underlined category headers.
3. **Restrained Layout Width:** A compact, centered container (`max-w-[800px]`) that preserves visual balance on modern ultrawide screens as well as mobile viewports.
4. **Authentic Imageboard Aesthetics:** 1px borders, subtle shaded title bars, bracketed navigation bars (`[ mc / tf2 / ... ]`), and traditional color palettes.

---

## 📐 Page Anatomy & Structure

The home page consists of four primary structural zones:

```text
┌────────────────────────────────────────────────────────────────────────┐
│ [ mc / tf2 / tes ] [ ai / vibe / nix ] [ moe / fa ]   [Catalog] [Theme]│
├────────────────────────────────────────────────────────────────────────┤
│                           [Clover Logo]                                │
│                              oomfit                                    │
│                                                                        │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ BOARDS — DIRECTORY                              18 boards visible  │ │
│ ├────────────────────────────────────────────────────────────────────┤ │
│ │ Presets: [Default] [Gaming] [Tech] ...     Search: [             ] │ │
│ ├──────────────────┬──────────────────┬──────────────────┬───────────┤ │
│ │ GAMES            │ TECHNOLOGY       │ AESTHETICS       │ CULTURE   │ │
│ │ Minecraft        │ AI               │ Moe              │ Cooking   │ │
│ │ TF2              │ Vibecoding       │ Fanart           │ Music     │ │
│ │ Skyrim           │ Linux            │ Vaporwave        │ Coffee    │ │
│ └──────────────────┴──────────────────┴──────────────────┴───────────┘ │
│                                                                        │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ [DEV GUIDE] PRESET COMMANDS                                        │ │
│ │ Clickable test shortcuts for preset slash commands                 │ │
│ └────────────────────────────────────────────────────────────────────┘ │
│                                                                        │
│ [ mc / tf2 / tes ] [ ai / vibe / nix ] [ moe / fa ]                    │
│ Home - Catalog - Rules - FAQ - Feedback                                │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 1. Global Top Navigation Header
- **Dynamic Bracketed Shortcodes:** Displays bracketed lists of board shortcodes reflecting the active preset or search results.
- **Utility Links:** Quick shortcut to `[Catalog]` and an instant **Theme Switcher** cycling between `Classic`, `Twitter`, and `Light`.

### 2. Branding Masthead
- Centered retro clover emblem and serif/sans-serif title (`oomfit`).
- Deliberately minimal to maintain focus directly on the directory.

### 3. The Boards Directory Box
The centerpiece of the home page, encapsulated in a single bordered box (`boxBorder`):
- **Title Bar (`boxHeader`):** Shaded header displaying the directory state (`Boards — Directory` or `Search: "query"`) and live count of visible boards.
- **Controls Subheader (`subHeader`):**
  - **Quick Preset Pills:** Clickable buttons to switch between curated presets (`[Default]`, `[Gaming]`, `[Consoles]`, etc.).
  - **Dual Search Field:** Minimalist filter input for preset slash commands (`/gaming`) or generic board discovery (`shooter`, `coffee`).
- **Category Columns:** A balanced 2 to 4 column responsive grid (`grid-cols-1 sm:grid-cols-2 md:grid-cols-4`).
  - **Category Header Bar:** Uppercase, underlined title (`categoryHeader`).
  - **Board Hyperlinks:** Plain text hyperlinks that navigate to `/catalog?b=[shortcode]`. Hovering turns links red (`#D00`) in Classic mode and `#1DA1F2` in Twitter mode.

### 4. Dev Guide / Hint Box
A compact reference panel located below the main directory box, listing available `/` slash commands (e.g. `/gaming`, `/anime`, `/retro`). Each command button is interactive, populating the search bar on click for rapid testing during development.

### 5. Classic Footer
- Repeated bracketed shortcode bar.
- Text links (`Home - Catalog - Rules - FAQ - Feedback`).
- Standard imageboard copyright and disclaimer notice.

---

## 🎨 Supported Themes

The home page fully respects the platform's three universal styling modes:

| Theme | Page Background | Box Header Bar | Category Titles | Link Colors |
|---|---|---|---|---|
| **Classic (Default)** | `#FFFFEE` (Yotsuba Beige) | `#F0E0D6` (Pale Brown) | `#800000` (Maroon) | `#0F0C5D` (Navy), hover `#D00` (Red) |
| **Twitter** | `#E6ECF0` (Twitter Canvas) | `#F5F8FA` (Cool Gray) | `#14171A` (Near Black) | `#1DA1F2` (Sky Blue) |
| **Light** | `slate-50` (Modern Clean) | `slate-100` (Slate Bar) | `slate-900` (Slate Bold) | `emerald-700` (Forest Green) |

---

## 🔗 Route Integration

- **Board Navigation:** All board hyperlinks route to `/catalog?b=[shortcode]` (e.g. `/catalog?b=mc`, `/catalog?b=tf2`).
- **Catalog Reflection:** The catalog page dynamically reads the `b` search parameter, rendering the corresponding board name and description in its header while skimmers explore the active threads.
