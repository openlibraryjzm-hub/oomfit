# Catalog Documentation (`catalog.md`)

This document provides a detailed breakdown of the **Catalog Board View** implemented in `src/app/page.tsx`.

---

## 🎯 Purpose & Design Philosophy

The catalog is the primary landing and discovery page of any board in **oomfit** (currently demonstrating `/fit/`). It offers a high-density, visual mosaic of active threads, allowing users to skim hundreds of conversations effortlessly.

---

## 📐 Layout & Zoom Flexibility (67% - 150%+)

A critical requirement of the catalog is complete flexibility across browser zoom levels without breaking layouts or introducing horizontal scrollbars:

- **Reflow Architecture:** Built using `flex flex-wrap justify-center` with explicit width constraints per card (`w-[145px]`, `w-[180px]`, or `w-[220px]`).
- **Zoom Response:**
  - **67% Zoom:** Automatically reflows into 10–14 columns per row.
  - **100% Zoom:** Reflows into 6–8 columns per row on desktop.
  - **133%–150% Zoom:** Smoothly drops to 4–5 columns per row.
  - **Mobile:** Reflows to 2 columns seamlessly.
- **Unified Background:** The cards do **not** have rectangular card border boxes or contrasting background panels. Thumbnails, metadata, bold titles, and teaser text sit directly on the page background canvas, matching genuine imageboard aesthetics.

---

## 🖼️ Realistic Thumbnail Aspect Ratios

Rather than forcing every image into an identical square, thumbnails simulate real-world uploads across varied photographic and digital aspect ratios:

| Aspect Ratio | Label | Common Use Case |
|---|---|---|
| **16:9** | `1920x1080` | Widescreen landscape, video stills |
| **4:3** | `1024x768` | Standard camera photos |
| **3:2** | `1200x800` | DSLR photography |
| **1:1** | `1080x1080` | Square avatars, album art, infographics |
| **4:5** & **3:4** | `1080x1350` | Standard portrait orientation |
| **9:16** | `1080x1920` | Smartphone vertical photos / stories |

All thumbnails are vertically and horizontally centered inside a bounded container (`thumbBoxHeight`) so column alignment stays clean while each image preserves its natural aspect ratio.

---

## 👤 User Accounts & Metadata

Each catalog card displays:
1. **Thumbnail Container:** Numbered placeholder badge with color tone, dimensions, and authentic `R:` (Replies) and `I:` (Images) counters.
2. **Author Identity:** Small circular avatar with initials and gradient background, horizontally aligned with `@username` and relative timestamp.
3. **Reply Count Summary:** Compact `R: 42 / I: 8` indicator.
4. **Thread Subject / Title:** Bold line-clamped header linking directly to `/thread/[id]`.
5. **Teaser Text:** 4-line truncated preview of the opening post.

---

## 🎛️ Header Controls & Interactivity

The top sticky navigation header includes:
- **Instant Search:** Client-side filter across thread title, teaser text, username, and post number.
- **Sorting Modes:**
  - `Bump`: Chronological bump order based on activity.
  - `Replies`: Sorted by highest reply count.
  - `Recent`: Sorted by creation date.
- **Card Size Toggle:** `S` (Compact, 145px), `M` (Medium, 180px, Default), and `L` (Large, 220px).
- **Theme Selector:** Seamlessly toggles between **Twitter**, **Classic Yotsuba**, and **Light**.

---

## 🔮 Future Enhancements
- Board selector dropdown (`/fit/`, `/g/`, `/biz/`, etc.).
- "Create New Board" button and modal for user-generated boards.
- Infinite scroll / pagination once connected to a backend database.
