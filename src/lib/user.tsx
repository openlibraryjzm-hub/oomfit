"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export interface UserProfileData {
  id: string;
  username: string;
  handle: string;
  bio: string;
  avatarBg: string;
  avatarText: string;
  initials: string;
}

export const AVATAR_COLOR_PRESETS = [
  { name: "Navy / Indigo", bg: "from-blue-600 to-indigo-800" },
  { name: "Emerald / Teal", bg: "from-emerald-600 to-teal-800" },
  { name: "Purple / Fuchsia", bg: "from-purple-600 to-fuchsia-800" },
  { name: "Amber / Orange", bg: "from-amber-600 to-orange-800" },
  { name: "Rose / Pink", bg: "from-rose-600 to-pink-800" },
  { name: "Cyan / Sky", bg: "from-cyan-600 to-blue-800" },
  { name: "Violet / Purple", bg: "from-violet-600 to-purple-800" },
  { name: "Maroon / Red", bg: "from-red-700 to-rose-950" },
  { name: "Slate / Charcoal", bg: "from-slate-700 to-zinc-900" },
];

export const DEFAULT_USER: UserProfileData = {
  id: "local_user",
  username: "Anonymous",
  handle: "anon",
  bio: "Lurking across boards.",
  avatarBg: "from-blue-600 to-indigo-800",
  avatarText: "text-white",
  initials: "AN",
};

const STORAGE_KEY = "oomfit_user_profile";
const UPDATE_EVENT = "oomfit_user_updated";

export function getStoredUserProfile(): UserProfileData {
  if (typeof window === "undefined") {
    return DEFAULT_USER;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_USER;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_USER,
      ...parsed,
    };
  } catch (e) {
    console.error("Failed to parse stored user profile", e);
    return DEFAULT_USER;
  }
}

export function saveStoredUserProfile(profile: Partial<UserProfileData>): UserProfileData {
  const current = getStoredUserProfile();
  const updated: UserProfileData = {
    ...current,
    ...profile,
  };
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event(UPDATE_EVENT));
    } catch (e) {
      console.error("Failed to save user profile", e);
    }
  }
  return updated;
}

export function useUserProfile() {
  const [user, setUser] = useState<UserProfileData>(DEFAULT_USER);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setUser(getStoredUserProfile());
    setIsLoaded(true);

    const handleUpdate = () => {
      setUser(getStoredUserProfile());
    };

    window.addEventListener(UPDATE_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener(UPDATE_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return { user, isLoaded, saveUser: saveStoredUserProfile };
}

export function ProfileBadge({ className = "" }: { className?: string }) {
  const { user, isLoaded } = useUserProfile();

  return (
    <Link
      href="/signup"
      className={`inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded-xs transition-opacity opacity-85 hover:opacity-100 hover:bg-black/5 shrink-0 ${className}`}
      title={`Identity Profile: ${user.username} (@${user.handle}) - Click to configure`}
    >
      <div
        className={`w-4 h-4 rounded-full bg-gradient-to-br ${user.avatarBg} text-white flex items-center justify-center font-bold text-[8px] shrink-0 shadow-xs`}
      >
        {isLoaded ? (user.initials || "AN") : "AN"}
      </div>
      <span className="font-semibold text-[11px] truncate max-w-[80px] sm:max-w-[110px]">
        {isLoaded ? user.username : "Anonymous"}
      </span>
      <span className="text-[10px] opacity-40 font-mono hidden md:inline">
        @{isLoaded ? user.handle : "anon"}
      </span>
    </Link>
  );
}
