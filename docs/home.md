# Home Page Documentation (`home.md`)

This document provides a comprehensive overview of the **Home Page Directory View** implemented in `src/app/page.tsx`.

---

## 🔌 Live Database & Custom Boards Integration

The directory dynamically aggregates:
1. **Core Registered Boards:** Built-in curated boards defined in `src/lib/boards.ts`.
2. **Community Created Boards:** Live user-created boards stored in Supabase (`boards` table).
3. **[+ Create Board] Modal:** Accessible directly from the top navigation bar and directory header. Visitors can register any new board with a custom slug/shortcode, title, cultural domain, description, and search tags. Once registered, it immediately indexes into the home directory and routes to its dedicated catalog.

---

## 🎯 Purpose & Design Philosophy

The home page acts as the primary navigational front door of **oomfit**. It is designed as an authentic homage to classic early-2000s imageboards (specifically `4chan.org`), prioritizing:

1. **Extreme Information Density & Clarity:** Pure text hyperlinks, zero distracting thumbnails, zero marketing fluff, and zero promotional banners.
2. **Distinct Category Hierarchy:** Boards organized into clean, vertical columns separated by bold, uppercase, underlined category headers.
3. **Restrained Layout Width:** A compact, centered container (`max-w-[800px]`) that preserves visual balance on modern ultrawide screens as well as mobile viewports.
4. **Authentic Imageboard Aesthetics:** 1px borders, subtle shaded title bars, bracketed navigation bars (`[ mc / tf2 / ... ]`), and traditional color palettes.
5. **Modern Interactive Enhancements:** Centered minimalist typewriter search with board highlighting, real-time dimming, and an interactive Board Preview Hero card on hover.

---

## 📐 Page Anatomy & Structure

The home page consists of four primary structural zones:

```text
┌────────────────────────────────────────────────────────────────────────┐
│ [Profile Badge] | [ mc / tf2 / tes ] [ ai / vibe ]    [Catalog] [Theme]│
├────────────────────────────────────────────────────────────────────────┤
│                           [Clover Logo]                                │
│                              oomfit                                    │
│                                                                        │
│                Search: anime _ [flashing cursor]                       │
│                                                                        │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ BOARDS — DIRECTORY                              20 boards visible  │ │
│ ├──────────────────┬──────────────────┬──────────────────┬───────────┤ │
│ │ GAMES            │ TECHNOLOGY       │ AESTHETICS       │ CULTURE   │ │
│ │ Minecraft        │ AI               │ Moe              │ Cooking   │ │
│ │ TF2              │ Vibecoding       │ Fanart           │ Music     │ │
│ │ Skyrim           │ Linux            │ Vaporwave        │ Coffee    │ │
│ └──────────────────┴──────────────────┴──────────────────┴───────────┘ │
│                                                                        │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ BOARD PREVIEW HERO                                      /vibe/     │ │
│ │ [Art Box]  /vibe/ - Vibecoding                                      │ │
│ │            Coding with AI assistants and natural language           │ │
│ │            [Enter /vibe/ Board →]                                  │ │
│ └────────────────────────────────────────────────────────────────────┘ │
│                                                                        │
│ [ mc / tf2 / tes ] [ ai / vibe / nix ] [ moe / fa ]                    │
│ Home - Catalog - Rules - FAQ - Feedback                                │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 1. Global Top Navigation Header
- **Profile Badge:** Fixed on the far left with avatar initials and username/handle, linking directly to `/signup`.
- **Dynamic Bracketed Shortcodes:** Displays bracketed lists of board shortcodes.
- **Utility Links:** Quick shortcut to `[+ Create Board]`, `[Catalog]`, and an instant **Theme Switcher** cycling between `Classic`, `Twitter`, and `Light`.

### 2. Branding Masthead & Minimalist Centered Search
- Centered retro clover emblem and serif/sans-serif title (`oomfit`).
- **Centered Typewriter Search Bar:**
  - Minimalist borderless/underline styling without heavy bounding boxes.
  - Flashing text cursor.
  - Automated typewriter cycles sample keywords (`anime`, `gaming`, `tech`, `retro`, `vibecoding`, etc.).
  - User click/focus halts animation immediately for fluid manual typing.
  - **Dynamic Board Highlighting:** Matching boards in the directory stay brightly visible and highlighted while non-matching boards dim to 25% opacity.

### 3. The Boards Directory Box
The centerpiece of the home page, encapsulated in a single bordered box (`boxBorder`):
- **Title Bar (`boxHeader`):** Shaded header displaying `Boards — Directory` and live count of visible boards.
- **Category Columns:** A balanced 2 to 4 column responsive grid (`grid-cols-1 sm:grid-cols-2 md:grid-cols-4`).
  - **Category Header Bar:** Uppercase, underlined title (`categoryHeader`).
  - **Board Hyperlinks:** Plain text hyperlinks that navigate to `/catalog?b=[shortcode]`. Hovering dynamically updates the preview hero below.

### 4. Interactive Board Preview Hero Card
Positioned directly below the directory box:
- Dynamically responds to board link hovers.
- Displays domain-styled retro pixel art canvas with board shortcode.
- Displays board title, domain, subcategory, detailed description, and tag pills.
- Quick **[Enter Board &rarr;]** action button linking to `/catalog?b=[shortcode]`.

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
- **Profile Navigation:** Global profile badge routes to `/signup`.
- **Catalog Reflection:** The catalog page dynamically reads the `b` search parameter, rendering the corresponding board name and description in its header.
