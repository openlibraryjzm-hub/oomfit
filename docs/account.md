# Account & Identity Documentation (`account.md`)

This document provides a comprehensive overview of the **Account & Identity Profile System** implemented in `src/app/signup/page.tsx` and `src/lib/user.tsx`.

---

## 🎯 Purpose & Philosophy

While **oomfit** stays faithful to early imageboard anonymity traditions, modern users frequently desire a customizable persona across threads and boards without heavy centralized authentication overhead.

The Account & Identity system balances both worlds:
1. **Zero Mandatory Sign-In:** Users can browse, lurk, and post anonymously at any time.
2. **Client-Side Storage Persistence:** Profiles are stored entirely locally on the user's browser device (`localStorage`). No tracking cookies, passwords, or cloud data harvesting.
3. **Omnipresent Global Navbar Badge:** A responsive identity indicator displayed on the far left of the top navigation bar across all primary views (`/`, `/catalog`, `/thread/[id]`).

---

## 📐 The `/signup` Route

The `/signup` page provides a dedicated workstation for configuring the visitor's local identity:

### Form Fields
- **Display Name / Username:** The user's public handle (e.g. `IronLifter`, `NeonHacker`, `Anonymous`). Max 30 chars.
- **Handle:** A Twitter-style handle formatted with an `@` prefix (e.g. `@ironlifter`).
- **Avatar Initials:** 1 to 3 uppercase letters rendered inside avatar badges. Automatically computed from username but freely customizable.
- **Avatar Color Presets:** Visual color picker offering 9 distinctive two-stop gradient themes:
  - Navy / Indigo (`from-blue-600 to-indigo-800`)
  - Emerald / Teal (`from-emerald-600 to-teal-800`)
  - Purple / Fuchsia (`from-purple-600 to-fuchsia-800`)
  - Amber / Orange (`from-amber-600 to-orange-800`)
  - Rose / Pink (`from-rose-600 to-pink-800`)
  - Cyan / Sky (`from-cyan-600 to-blue-800`)
  - Violet / Purple (`from-violet-600 to-purple-800`)
  - Maroon / Red (`from-red-700 to-rose-950`)
  - Slate / Charcoal (`from-slate-700 to-zinc-900`)
- **Bio / Status:** A short status message (up to 160 characters).

### Real-Time Live Preview
A side-by-side preview card updates in real time as the user edits their profile, showing:
- Large avatar badge with gradient and initials
- User handle and bio quotation
- Live simulation of the global navbar badge

---

## 🧩 Architecture & Persistence (`src/lib/user.tsx`)

### Data Model
```typescript
export interface UserProfileData {
  id: string;
  username: string;
  handle: string;
  bio: string;
  avatarBg: string;
  avatarText: string;
  initials: string;
}
```

### Storage Key & React Hook
- **Key:** `oomfit_user_profile` in browser `localStorage`.
- **Default Profile:**
  ```typescript
  export const DEFAULT_USER: UserProfileData = {
    id: "local_user",
    username: "Anonymous",
    handle: "anon",
    bio: "Lurking across boards.",
    avatarBg: "from-blue-600 to-indigo-800",
    avatarText: "text-white",
    initials: "AN",
  };
  ```
- **`useUserProfile()` Hook:** Returns `{ user, isLoaded, saveUser }`. Automatically listens to custom window event `oomfit_user_updated` and the native `storage` event so that changes immediately synchronize across multiple open tabs.
- **`ProfileBadge` Component:** Lightweight badge that mounts in all navigation headers, displaying the user's avatar circle, display name, and handle, linking to `/signup`.

---

## 🎨 Supported Themes

The `/signup` page supports the same platform themes as the rest of the application:
- **Classic:** Yotsuba beige background with maroon headers and buttons.
- **Twitter:** Modern cool-gray canvas with sky-blue accents.
- **Light:** Clean white and emerald tones.
