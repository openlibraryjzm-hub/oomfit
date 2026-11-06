"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Sun,
  Flame,
  Clock,
  MessageSquare,
  Sparkles,
} from "lucide-react";

function TwitterIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.936 9.936 0 0024 4.59z" />
    </svg>
  );
}
import { initialPosts } from "@/lib/data";

type CardSize = "compact" | "medium" | "large";
type ThemeMode = "classic" | "twitter" | "light";

export default function CatalogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [cardSize, setCardSize] = useState<CardSize>("medium");
  const [theme, setTheme] = useState<ThemeMode>("twitter"); // Default to new Twitter theme
  const [sortBy, setSortBy] = useState<"bump" | "replies" | "recent">("bump");

  // Filtering and sorting
  const filteredPosts = useMemo(() => {
    let result = initialPosts.filter((post) => {
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        post.title.toLowerCase().includes(q) ||
        post.teaser.toLowerCase().includes(q) ||
        post.user.username.toLowerCase().includes(q) ||
        post.id.toString().includes(q) ||
        post.threadNumber.toString().includes(q)
      );
    });

    if (sortBy === "replies") {
      result = [...result].sort((a, b) => b.replies - a.replies);
    } else if (sortBy === "recent") {
      result = [...result].sort((a, b) => b.id - a.id);
    }
    return result;
  }, [searchQuery, sortBy]);

  // Dimensions per size setting
  const cardWidthClass = {
    compact: "w-[145px] text-xs",
    medium: "w-[180px] text-[13px]",
    large: "w-[220px] text-sm",
  }[cardSize];

  const thumbBoxHeight = {
    compact: "h-[120px]",
    medium: "h-[150px]",
    large: "h-[180px]",
  }[cardSize];

  // Theme styling definitions
  const themeBg = {
    classic: "bg-[#FFFFEE] text-[#000000]",
    twitter: "bg-[#E6ECF0] text-[#14171A]",
    light: "bg-white text-slate-900",
  }[theme];

  const headerBg = {
    classic: "bg-[#F0E0D6] border-[#D9BFB7] text-[#800000]",
    twitter: "bg-white/95 border-[#E1E8ED] text-[#14171A] shadow-[0_1px_3px_rgba(0,0,0,0.06)]",
    light: "bg-slate-100/90 border-slate-200 text-slate-800",
  }[theme];

  return (
    <div className={`min-h-screen ${themeBg} flex flex-col font-sans transition-colors duration-150`}>
      {/* Top Banner / Board Header */}
      <header className={`sticky top-0 z-30 border-b backdrop-blur-md px-4 py-2.5 shadow-sm ${headerBg}`}>
        <div className="mx-auto flex max-w-[1920px] flex-wrap items-center justify-between gap-3">
          {/* Board Title & Brand */}
          <div className="flex items-center gap-3">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full font-bold text-sm ${
                theme === "twitter"
                  ? "bg-[#1DA1F2] text-white shadow-sm"
                  : "bg-emerald-500/20 text-emerald-700"
              }`}
            >
              {theme === "twitter" ? (
                <TwitterIcon className="h-4.5 w-4.5 fill-current" />
              ) : (
                "/fit/"
              )}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold tracking-tight text-base sm:text-lg">
                  oomfit
                </h1>
                <span className="text-xs opacity-60 font-mono">Catalog</span>
              </div>
              <p className="text-[11px] opacity-70">
                SFW Fitness Community • Showing {filteredPosts.length} of {initialPosts.length} threads
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative min-w-[200px] flex-1 max-w-md">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 opacity-50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search catalog (e.g. IronLifter, #42, routine)..."
              className={`w-full rounded-full border py-1.5 pl-8 pr-3 text-xs outline-none focus:ring-1 ${
                theme === "twitter"
                  ? "border-[#E1E8ED] bg-[#F5F8FA] text-[#14171A] placeholder-[#657786] focus:border-[#1DA1F2] focus:ring-[#1DA1F2] focus:bg-white"
                  : theme === "classic"
                  ? "border-[#D9BFB7] bg-white text-black placeholder-zinc-400 focus:border-[#800000] focus:ring-[#800000]"
                  : "border-slate-300 bg-white text-black placeholder-slate-400 focus:border-slate-500 focus:ring-slate-400"
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs opacity-60 hover:opacity-100"
              >
                ✕
              </button>
            )}
          </div>

          {/* Controls: Sorting, Size, Theme */}
          <div className="flex items-center gap-2 text-xs">
            {/* Sort Buttons */}
            <div className="flex items-center rounded-full border border-current/20 p-0.5">
              <button
                onClick={() => setSortBy("bump")}
                className={`flex items-center gap-1 rounded-full px-2.5 py-1 transition-all ${
                  sortBy === "bump"
                    ? theme === "twitter"
                      ? "bg-[#1DA1F2] text-white font-medium"
                      : "bg-emerald-600 text-white font-medium"
                    : "opacity-70 hover:opacity-100"
                }`}
                title="Bump Order"
              >
                <Flame className="h-3 w-3" />
                <span className="hidden sm:inline">Bump</span>
              </button>
              <button
                onClick={() => setSortBy("replies")}
                className={`flex items-center gap-1 rounded-full px-2.5 py-1 transition-all ${
                  sortBy === "replies"
                    ? theme === "twitter"
                      ? "bg-[#1DA1F2] text-white font-medium"
                      : "bg-emerald-600 text-white font-medium"
                    : "opacity-70 hover:opacity-100"
                }`}
                title="Reply Count"
              >
                <MessageSquare className="h-3 w-3" />
                <span className="hidden sm:inline">Replies</span>
              </button>
              <button
                onClick={() => setSortBy("recent")}
                className={`flex items-center gap-1 rounded-full px-2.5 py-1 transition-all ${
                  sortBy === "recent"
                    ? theme === "twitter"
                      ? "bg-[#1DA1F2] text-white font-medium"
                      : "bg-emerald-600 text-white font-medium"
                    : "opacity-70 hover:opacity-100"
                }`}
                title="Creation Time"
              >
                <Clock className="h-3 w-3" />
                <span className="hidden sm:inline">Recent</span>
              </button>
            </div>

            {/* Thumbnail Size Selector */}
            <div className="hidden sm:flex items-center rounded-full border border-current/20 p-0.5">
              <button
                onClick={() => setCardSize("compact")}
                className={`rounded-full px-2 py-0.5 text-[11px] ${
                  cardSize === "compact"
                    ? theme === "twitter"
                      ? "bg-[#1DA1F2] text-white font-medium"
                      : "bg-emerald-600 text-white font-medium"
                    : "opacity-70 hover:opacity-100"
                }`}
              >
                S
              </button>
              <button
                onClick={() => setCardSize("medium")}
                className={`rounded-full px-2 py-0.5 text-[11px] ${
                  cardSize === "medium"
                    ? theme === "twitter"
                      ? "bg-[#1DA1F2] text-white font-medium"
                      : "bg-emerald-600 text-white font-medium"
                    : "opacity-70 hover:opacity-100"
                }`}
              >
                M
              </button>
              <button
                onClick={() => setCardSize("large")}
                className={`rounded-full px-2 py-0.5 text-[11px] ${
                  cardSize === "large"
                    ? theme === "twitter"
                      ? "bg-[#1DA1F2] text-white font-medium"
                      : "bg-emerald-600 text-white font-medium"
                    : "opacity-70 hover:opacity-100"
                }`}
              >
                L
              </button>
            </div>

            {/* Theme Toggle (Classic -> Twitter -> Light) */}
            <button
              onClick={() => {
                const next: ThemeMode =
                  theme === "twitter" ? "classic" : theme === "classic" ? "light" : "twitter";
                setTheme(next);
              }}
              className="flex items-center gap-1.5 rounded-full border border-current/20 px-3 py-1 text-xs font-medium opacity-80 hover:opacity-100 transition-all"
              title="Cycle Theme: Twitter -> Classic -> Light"
            >
              {theme === "twitter" ? (
                <>
                  <TwitterIcon className="h-3.5 w-3.5 text-[#1DA1F2] fill-[#1DA1F2]" />
                  <span className="font-semibold text-[#1DA1F2]">Twitter</span>
                </>
              ) : theme === "classic" ? (
                <>
                  <Sparkles className="h-3.5 w-3.5 text-amber-700" />
                  <span>Classic</span>
                </>
              ) : (
                <>
                  <Sun className="h-3.5 w-3.5 text-amber-600" />
                  <span>Light</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Catalog Flexible Grid Container */}
      <main className="flex-1 p-3 sm:p-6 max-w-[1920px] mx-auto w-full">
        {filteredPosts.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-sm opacity-60">No threads match &quot;{searchQuery}&quot;</p>
            <button
              onClick={() => setSearchQuery("")}
              className={`mt-3 text-xs underline ${
                theme === "twitter" ? "text-[#1DA1F2]" : "text-emerald-600"
              }`}
            >
              Clear search filter
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap items-start justify-center gap-x-4 gap-y-7 sm:gap-x-5 sm:gap-y-8">
            {filteredPosts.map((post) => (
              <Link
                key={post.id}
                href={`/thread/${post.id}`}
                className={`group flex flex-col items-center text-center cursor-pointer select-none transition-transform duration-100 ${cardWidthClass}`}
                title={`No. ${post.threadNumber}\n${post.title}`}
              >
                {/* 1. IMAGE PLACEHOLDER (Realistic aspect ratios bounded inside catalog box) */}
                <div
                  className={`w-full flex items-center justify-center mb-1.5 ${thumbBoxHeight}`}
                >
                  <div
                    className={`relative overflow-hidden rounded-lg bg-gradient-to-br ${post.colorTone} flex flex-col items-center justify-center border border-black/10 shadow-sm transition-transform duration-150 group-hover:scale-[1.03] group-hover:shadow-md ${post.aspect.ratioClass}`}
                  >
                    {/* R / I metadata tag overlay */}
                    <div className="absolute top-1 right-1 rounded-full bg-black/75 px-1.5 py-0.5 text-[8px] font-mono text-white backdrop-blur-[2px]">
                      R: {post.replies} / I: {post.images}
                    </div>

                    <span className="text-[9px] uppercase font-mono tracking-wider opacity-70 text-zinc-800">
                      IMG #{post.id}
                    </span>
                    <span className="text-xl sm:text-2xl font-black tracking-tight font-mono text-zinc-950">
                      #{post.id}
                    </span>
                    <span className="text-[8.5px] font-mono opacity-70 text-zinc-800">
                      {post.aspect.dimLabel}
                    </span>
                  </div>
                </div>

                {/* Author Avatar + Name horizontally aligned */}
                <div className="flex items-center gap-1.5 text-[11px] mb-1 opacity-80 group-hover:opacity-100">
                  <div
                    className={`w-4 h-4 rounded-full bg-gradient-to-br ${post.user.avatarBg} flex items-center justify-center text-[7px] font-bold text-white shadow-xs shrink-0`}
                  >
                    {post.user.initials}
                  </div>
                  <span
                    className={`font-semibold ${
                      theme === "twitter"
                        ? "text-[#14171A] group-hover:text-[#1DA1F2]"
                        : "text-emerald-800"
                    }`}
                  >
                    {post.user.username}
                  </span>
                  <span
                    className={`text-[10px] font-mono ${
                      theme === "twitter" ? "text-[#657786]" : "opacity-50"
                    }`}
                  >
                    • {post.timestamp}
                  </span>
                </div>

                {/* Quick stats under image */}
                <div
                  className={`text-[10px] font-mono mb-1 ${
                    theme === "twitter" ? "text-[#657786]" : "opacity-60"
                  }`}
                >
                  R: <span className="font-semibold">{post.replies}</span> / I:{" "}
                  <span className="font-semibold">{post.images}</span>
                </div>

                {/* 2. TITLE (Directly below image, bold, sitting on page background) */}
                <h2
                  className={`w-full font-bold leading-tight line-clamp-2 mb-1 transition-colors ${
                    theme === "classic"
                      ? "text-[#0F0C5D] group-hover:text-[#D00] group-hover:underline"
                      : theme === "twitter"
                      ? "text-[#14171A] group-hover:text-[#1DA1F2]"
                      : "text-slate-900 group-hover:text-emerald-700"
                  }`}
                >
                  {post.title}
                </h2>

                {/* 3. POST TEXT (Teaser entries sitting on page background) */}
                <p
                  className={`w-full line-clamp-4 leading-relaxed text-[11px] sm:text-[12px] ${
                    theme === "classic"
                      ? "text-[#111] opacity-80"
                      : theme === "twitter"
                      ? "text-[#657786]"
                      : "text-slate-600 opacity-80"
                  }`}
                >
                  {post.teaser}
                </p>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Catalog Footer */}
      <footer className={`border-t py-6 text-center text-xs opacity-60 ${headerBg}`}>
        <p>oomfit Catalog • 150 Threads • Themes: Twitter, Classic & Light • Reflow (67% - 150%)</p>
      </footer>
    </div>
  );
}
