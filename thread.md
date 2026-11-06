# Thread Documentation (`thread.md`)

This document provides a detailed breakdown of the **Thread View** implemented in `src/app/thread/[id]/page.tsx`.

---

## 🎯 Purpose & Design Philosophy

The thread view displays an individual discussion thread. It combines:
1. **Classic imageboard density** (left-aligned layout, compact post cards, media floated next to text, greentext syntax).
2. **Modern user accounts** (circular avatars, persistent usernames).
3. **4chan X Power-User UX** (hover preview tooltips and recursive inline quote expansion).

---

## 📐 Layout Architecture

- **Strict Left-Alignment:** Content is **not** centered (`mx-auto` containers removed). Posts, navigation controls, and forms align to the left side of the screen with responsive horizontal padding (`px-4 sm:px-6`).
- **Flat Chronological Base:** The underlying thread is rendered in sequential chronological order from top to bottom (Original Post followed by replies).

---

## ⚡ 4chan X Quote & Inlining System

### 1. Floating Hover Preview Tooltip
- **Trigger:** Hovering over any quote link (`>>No.`) in a comment or hovering over any replier avatar in a post header.
- **Behavior:** Renders an absolute-positioned floating preview card directly below/beside the cursor, containing:
  - The author's circular avatar and username.
  - Post number and timestamp.
  - Attached media thumbnail and file specifications.
  - Full comment text with greentext styling.
- **Dismissal:** Automatically dismisses when the mouse leaves with a subtle debounce delay.

### 2. Left-Click Recursive Inlining (Inside the Card)
- **Trigger:** Left-clicking any quote link or replier avatar.
- **Behavior:** Does **not** jump or scroll the page away. Instead, it embeds/inlines the referenced post card **directly inside the current post card**.
- **Placement:** The inlined post is injected **above the current post's image and comment text**, enclosed in an indented accent container (`inlineBorder`).
- **Recursive Stacking:** Inlined posts remain fully interactive. If an inlined post quotes an earlier post, clicking that quote injects the next post inside its container, creating a clean inline chain.
- **Closing Inlined Cards:** Each inlined card features a dedicated `[close]` button. Clicking the quote link again also toggles the inlined post off.

> ⚠️ **Architecture Note (React State Stability):**  
> `<PostCard>` is declared at the module level (outside the `ThreadContent` function component). This prevents React from unmounting and resetting the card's local `inlinedPosts` array whenever the parent component re-renders to show or hide the floating hover preview.

---

## 🧩 Post Anatomy

Each post (OP or reply) consists of the following components:

```text
┌────────────────────────────────────────────────────────────────────────┐
│ [Avatar] Username @handle  [OP]  11/07/26(Sat)08:12  No.1000048         │
│ replies: [Avatar1] [Avatar2] [Avatar3]                                 │
├────────────────────────────────────────────────────────────────────────┤
│ [Inlined Post Box - Appears here if a quote/avatar is clicked]         │
├────────────────────────────────────────────────────────────────────────┤
│ File: workout_chart.png (240 KB, 1920x1080)                            │
├────────────────────┬───────────────────────────────────────────────────┤
│                    │ [Avatar] @IronLifter [inline ↴]                   │
│  [Thumbnail IMG]   │                                                   │
│  (Click to Expand) │ >greentext line                                   │
│                    │ Regular comment body discussion text...           │
└────────────────────┴───────────────────────────────────────────────────┘
```

1. **Header Line:**
   - **User Identity:** Small circular avatar with gradient background + initials, followed by bold username and `@handle`.
   - **Post Metadata:** Timestamp and clickable post ID (`No. [postNumber]`) that pre-fills the quick reply form.
   - **Horizontally Aligned Replier Avatars:** A row of small circular avatars representing users who replied to this post. Clicking an avatar inlines that user's reply; hovering previews it.
2. **File Info Bar:** File name, file size, and image resolution (only present on posts with media attachments).
3. **Media Container:** Numbered placeholder thumbnail with a click-to-expand toggle (`Maximize2` / `Minimize2`).
4. **Comment Body:**
   - Greentext syntax (lines starting with `>`) styled in vibrant green.
   - Interactive quote buttons displaying target user avatars and names.

---

## 🎭 Supported Reply Types

The generator in `src/lib/data.ts` populates threads with a realistic mix:
- **Image + Text:** Full post with file header, thumbnail on left, and comment on right.
- **Image Only:** Post with file header and thumbnail, with no text body.
- **Text Only:** Lightweight post without file bar or thumbnail, presenting pure text and quote backlinks.

---

## 🎨 Theme Support

The thread page seamlessly switches between three themes:
- **Twitter (Default):** Cool `#E6ECF0` canvas, `#FFFFFF` cards with `#E1E8ED` borders, `#1DA1F2` blue accents, and rounded pill reply buttons.
- **Classic:** Authentic Yotsuba beige (`#FFFFEE` canvas, `#F0E0D6` reply cards, `#800000` maroon, `#0F0C5D` navy).
- **Light:** Clean modern slate palette.
