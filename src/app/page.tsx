"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  executeDualSearch,
  DualSearchResult,
  Board,
  allBoards,
} from "@/lib/boards";
import { fetchBoards, createCustomBoard } from "@/lib/client-api";
import { FolderPlus, Plus, X, Sparkles, ArrowRight } from "lucide-react";
import { ProfileBadge } from "@/lib/user";

function TwitterIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.936 9.936 0 0024 4.59z" />
    </svg>
  );
}

// Classic 4chan Clover Icon
function CloverIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 4.5c-1.1-1.7-3.1-2.5-5-2-2.3.6-3.8 2.8-3.5 5.2.3 2.2 2 3.9 4 4.3H12v-7.5zm0 15c-1.1 1.7-3.1 2.5-5 2-2.3-.6-3.8-2.8-3.5-5.2.3-2.2 2-3.9 4-4.3H12v7.5zm7.5-7.5c1.7-1.1 2.5-3.1 2-5-.6-2.3-2.8-3.8-5.2-3.5-2.2.3-3.9 2-4.3 4V12h7.5zm0 0c1.7 1.1 2.5 3.1 2 5-.6 2.3-2.8 3.8-5.2 3.5-2.2-.3-3.9-2-4.3-4V12h7.5z" />
    </svg>
  );
}

type ThemeMode = "classic" | "twitter" | "light";

function BoardPlaceholderArt({ board }: { board: Board }) {
  const domainColors: Record<string, { bg: string; text: string; border: string }> = {
    Gaming: { bg: "from-amber-600/20 to-orange-600/30", text: "text-amber-600", border: "border-amber-500/30" },
    Technology: { bg: "from-emerald-600/20 to-teal-600/30", text: "text-emerald-600", border: "border-emerald-500/30" },
    Aesthetics: { bg: "from-purple-600/20 to-pink-600/30", text: "text-purple-600", border: "border-purple-500/30" },
    Culture: { bg: "from-rose-600/20 to-red-600/30", text: "text-rose-600", border: "border-rose-500/30" },
    Default: { bg: "from-blue-600/20 to-indigo-600/30", text: "text-blue-600", border: "border-blue-500/30" },
  };
  const color = domainColors[board.domain] || domainColors.Default;

  return (
    <div className={`w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-xs border ${color.border} bg-gradient-to-br ${color.bg} p-2 flex flex-col items-center justify-between font-mono relative overflow-hidden select-none shadow-2xs`}>
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:6px_6px] pointer-events-none" />
      <span className="text-[9px] uppercase tracking-wider font-bold opacity-60 self-start z-10">
        /{board.shortcode}/
      </span>
      <div className={`text-xl sm:text-2xl font-extrabold tracking-tighter ${color.text} z-10`}>
        {board.shortcode.toUpperCase()}
      </div>
      <span className="text-[8px] font-sans opacity-70 truncate max-w-full z-10">
        {board.domain}
      </span>
    </div>
  );
}

export default function HomePage() {
  const [theme, setTheme] = useState<ThemeMode>("classic");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [customBoards, setCustomBoards] = useState<Board[]>([]);
  const [hoveredBoard, setHoveredBoard] = useState<Board | null>(null);

  // Modal: Create Custom Board
  const [isNewBoardOpen, setIsNewBoardOpen] = useState(false);
  const [boardShortcode, setBoardShortcode] = useState("");
  const [boardName, setBoardName] = useState("");
  const [boardDomain, setBoardDomain] = useState("Technology");
  const [boardDescription, setBoardDescription] = useState("");
  const [boardTags, setBoardTags] = useState("");
  const [isSubmittingBoard, setIsSubmittingBoard] = useState(false);
  const [boardError, setBoardError] = useState("");

  const loadBoards = async () => {
    try {
      const all = await fetchBoards();
      // filter only boards that are not the built-in 105
      const staticCodes = new Set(allBoards.map((b) => b.shortcode.toLowerCase()));
      const onlyCustom = all.filter((b) => !staticCodes.has(b.shortcode.toLowerCase()));
      setCustomBoards(onlyCustom);
    } catch (err) {
      console.error("Failed to load custom boards:", err);
    }
  };

  useEffect(() => {
    loadBoards();
  }, []);

  // Permanent default to primary board categories ("default"), or dynamic search filter
  const dualResult: DualSearchResult = useMemo(() => {
    return executeDualSearch(searchQuery, "default", customBoards);
  }, [searchQuery, customBoards]);

  const activeHeroBoard = useMemo(() => {
    if (hoveredBoard) return hoveredBoard;
    return allBoards.find((b) => b.shortcode === "vibe") || allBoards[0];
  }, [hoveredBoard]);

  // Flattened visible boards for top/bottom bracketed global nav
  const visibleBoards = useMemo(() => {
    const list = dualResult.categories.flatMap((c) => c.boards);
    const seen = new Set<string>();
    return list.filter((b) => {
      if (seen.has(b.shortcode)) return false;
      seen.add(b.shortcode);
      return true;
    });
  }, [dualResult]);

  // Create Board Handler
  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!boardShortcode.trim() || !boardName.trim()) {
      setBoardError("Shortcode and board name are required.");
      return;
    }
    setIsSubmittingBoard(true);
    setBoardError("");

    try {
      const board = await createCustomBoard({
        shortcode: boardShortcode.trim(),
        name: boardName.trim(),
        domain: boardDomain.trim(),
        description: boardDescription.trim(),
        tags: boardTags.split(",").map((s) => s.trim()).filter(Boolean),
      });

      setIsNewBoardOpen(false);
      setBoardShortcode("");
      setBoardName("");
      setBoardDescription("");
      setBoardTags("");
      window.location.href = `/catalog?b=${board.shortcode}`;
    } catch (err: any) {
      setBoardError(err.message || "Failed to create board.");
    } finally {
      setIsSubmittingBoard(false);
    }
  };

  // Early 2000s CSS style map
  const themeStyles = {
    classic: {
      pageBg: "bg-[#FFFFEE] text-[#000000]",
      topNav: "bg-[#F0E0D6] border-b border-[#D9BFB7] text-[#800000]",
      topNavBrackets: "text-[#800000]/60",
      topNavLink: "text-[#0F0C5D] hover:text-[#D00] hover:underline font-mono",
      boxBorder: "border-[#D9BFB7] bg-[#FFFFEE]",
      boxHeader: "bg-[#F0E0D6] border-b border-[#D9BFB7] text-[#800000]",
      subHeader: "bg-[#FFFFEE] border-b border-[#D9BFB7]/60 text-[#444444]",
      categoryHeader: "text-[#800000] border-b border-[#D9BFB7]",
      boardLink: "text-[#0F0C5D] hover:text-[#D00] hover:underline",
      presetActive: "font-bold text-[#800000] underline",
      presetInactive: "text-[#0F0C5D] hover:underline hover:text-[#D00]",
      inputBg: "bg-white border-[#D9BFB7] text-black focus:border-[#800000]",
      badgePreset: "bg-[#800000]/10 text-[#800000] border border-[#800000]/20",
      badgeGeneric: "bg-[#0F0C5D]/10 text-[#0F0C5D] border border-[#0F0C5D]/20",
      footer: "text-[#707070]",
      footerLink: "text-[#0F0C5D] hover:text-[#D00] hover:underline",
      logoColor: "text-[#117743]",
      modal: "bg-[#FFFFEE] border-[#800000] text-black",
    },
    twitter: {
      pageBg: "bg-[#E6ECF0] text-[#14171A]",
      topNav: "bg-white border-b border-[#E1E8ED] text-[#657786]",
      topNavBrackets: "text-[#657786]/60",
      topNavLink: "text-[#1DA1F2] hover:underline font-mono",
      boxBorder: "border-[#E1E8ED] bg-white",
      boxHeader: "bg-[#F5F8FA] border-b border-[#E1E8ED] text-[#14171A]",
      subHeader: "bg-white border-b border-[#E1E8ED] text-[#657786]",
      categoryHeader: "text-[#14171A] border-b border-[#E1E8ED]",
      boardLink: "text-[#1DA1F2] hover:underline",
      presetActive: "font-bold text-[#1DA1F2] underline",
      presetInactive: "text-[#657786] hover:text-[#1DA1F2] hover:underline",
      inputBg: "bg-[#F5F8FA] border-[#E1E8ED] text-[#14171A] focus:border-[#1DA1F2] focus:bg-white",
      badgePreset: "bg-[#1DA1F2]/10 text-[#1DA1F2] border border-[#1DA1F2]/20",
      badgeGeneric: "bg-slate-200 text-slate-800 border border-slate-300",
      footer: "text-[#657786]",
      footerLink: "text-[#1DA1F2] hover:underline",
      logoColor: "text-[#1DA1F2]",
      modal: "bg-white border-[#CCD6DD] text-[#14171A] shadow-xl",
    },
    light: {
      pageBg: "bg-slate-50 text-slate-800",
      topNav: "bg-white border-b border-slate-200 text-slate-700",
      topNavBrackets: "text-slate-400",
      topNavLink: "text-emerald-700 hover:underline font-mono",
      boxBorder: "border-slate-300 bg-white",
      boxHeader: "bg-slate-100 border-b border-slate-300 text-slate-800",
      subHeader: "bg-slate-50 border-b border-slate-200 text-slate-600",
      categoryHeader: "text-slate-900 border-b border-slate-200",
      boardLink: "text-emerald-700 hover:underline hover:text-emerald-900",
      presetActive: "font-bold text-emerald-700 underline",
      presetInactive: "text-slate-600 hover:text-emerald-700 hover:underline",
      inputBg: "bg-white border-slate-300 text-slate-900 focus:border-emerald-600",
      badgePreset: "bg-emerald-600/10 text-emerald-800 border border-emerald-600/20",
      badgeGeneric: "bg-slate-100 text-slate-800 border border-slate-300",
      footer: "text-slate-500",
      footerLink: "text-emerald-700 hover:underline",
      logoColor: "text-emerald-600",
      modal: "bg-white border-slate-300 text-slate-900 shadow-xl",
    },
  }[theme];

  return (
    <div className={`min-h-screen ${themeStyles.pageBg} font-sans flex flex-col transition-colors duration-150`}>
      {/* 1. GLOBAL TOP BRACKETED NAVIGATION BAR */}
      <header className={`px-2 sm:px-4 py-1.5 text-xs select-none ${themeStyles.topNav}`}>
        <div className="flex flex-wrap items-center justify-between gap-2 max-w-[1920px] mx-auto">
          {/* Profile Badge & Bracketed Shortcode Bar */}
          <div className="flex flex-wrap items-center gap-2 text-[11px] leading-tight">
            <ProfileBadge />
            <span className="opacity-30">|</span>
            <span className="font-mono">
              <span className={themeStyles.topNavBrackets}>[ </span>
              {visibleBoards.map((b, i) => (
                <React.Fragment key={b.id}>
                  <Link
                    href={`/catalog?b=${b.shortcode}`}
                    className={themeStyles.topNavLink}
                    title={b.name}
                  >
                    {b.shortcode}
                  </Link>
                  {i < visibleBoards.length - 1 && (
                    <span className="opacity-40 mx-0.5">/</span>
                  )}
                </React.Fragment>
              ))}
              <span className={themeStyles.topNavBrackets}> ]</span>
            </span>
          </div>

          {/* Right Action Links */}
          <div className="flex items-center gap-2 sm:gap-3 text-xs shrink-0">
            <button
              onClick={() => setIsNewBoardOpen(true)}
              className="flex items-center gap-1 font-semibold hover:underline opacity-80 hover:opacity-100 text-[11px]"
              title="Create a new board like a subreddit"
            >
              <FolderPlus className="h-3 w-3" />
              <span>[+ Create Board]</span>
            </button>

            <span className="opacity-30">|</span>

            <Link
              href="/catalog"
              className={`font-semibold hover:underline ${
                theme === "twitter"
                  ? "text-[#1DA1F2]"
                  : theme === "classic"
                  ? "text-[#800000]"
                  : "text-emerald-700"
              }`}
            >
              [Catalog]
            </Link>

            <span className="opacity-30">|</span>

            <button
              onClick={() => {
                const next: ThemeMode =
                  theme === "classic" ? "twitter" : theme === "twitter" ? "light" : "classic";
                setTheme(next);
              }}
              className="opacity-75 hover:opacity-100 text-[10px] cursor-pointer flex items-center gap-1"
              title="Switch theme"
            >
              {theme === "classic" ? (
                <span>[Theme: Classic]</span>
              ) : theme === "twitter" ? (
                <span>[Theme: Twitter]</span>
              ) : (
                <span>[Theme: Light]</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN CENTERED CONTENT CONTAINER */}
      <main className="flex-1 w-full max-w-[800px] mx-auto px-3 sm:px-4 py-5 sm:py-7 space-y-4">
        {/* LOGO & SITE TITLE */}
        <div className="text-center space-y-1 select-none">
          <div className="flex items-center justify-center gap-2">
            <div className={themeStyles.logoColor}>
              {theme === "twitter" ? (
                <TwitterIcon className="h-8 w-8" />
              ) : (
                <CloverIcon className="h-9 w-9" />
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-serif">
              oomfit
            </h1>
          </div>
        </div>

        {/* 3. THE BOARDS DIRECTORY BOX */}
        <div className={`border rounded-[3px] shadow-2xs overflow-hidden ${themeStyles.boxBorder}`}>
          {/* Box Header Bar */}
          <div className={`py-1.5 px-3 flex items-center justify-between text-xs sm:text-sm font-bold uppercase tracking-wide ${themeStyles.boxHeader}`}>
            <span>Boards — Directory</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsNewBoardOpen(true)}
                className="text-[10px] lowercase font-normal underline opacity-80 hover:opacity-100 cursor-pointer flex items-center gap-1"
              >
                <Plus className="h-2.5 w-2.5" />
                <span>create board</span>
              </button>
              <span className="text-[10px] font-mono font-normal opacity-70">
                {visibleBoards.length} boards visible
              </span>
            </div>
          </div>

          {/* Minimal Controls Bar */}
          <div className={`p-2 sm:px-3 text-xs flex items-center justify-end gap-2 border-b border-current/10 ${themeStyles.subHeader}`}>
            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              <label htmlFor="board-filter" className="text-[11px] font-mono opacity-70 whitespace-nowrap">
                Search:
              </label>
              <div className="relative flex-1 sm:w-56">
                <input
                  id="board-filter"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter boards..."
                  className={`w-full border rounded-[2px] px-2 py-0.5 text-xs outline-none font-mono ${themeStyles.inputBg}`}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[10px] opacity-60 hover:opacity-100"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Category Columns */}
          <div className="p-3 sm:p-5">
            {dualResult.categories.length === 0 ? (
              <div className="py-12 text-center text-xs opacity-60 space-y-2">
                <p>No boards found matching &quot;{searchQuery}&quot;.</p>
                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={() => setSearchQuery("")}
                    className="underline text-[11px] cursor-pointer"
                  >
                    Clear search query
                  </button>
                  <button
                    onClick={() => setIsNewBoardOpen(true)}
                    className="underline font-bold text-[11px] cursor-pointer text-[#1DA1F2]"
                  >
                    Create /{searchQuery.toLowerCase().replace(/[^a-z0-9]/g, "")}/ board!
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-5">
                {dualResult.categories.map((cat, idx) => (
                  <div key={idx} className="space-y-1.5">
                    {/* Column Header */}
                    <div className={`pb-1 font-bold text-[11px] uppercase tracking-wide flex items-center justify-between ${themeStyles.categoryHeader}`}>
                      <span>{cat.name}</span>
                      <span className="font-mono text-[9px] opacity-50 font-normal">
                        ({cat.boards.length})
                      </span>
                    </div>

                    {/* Board List */}
                    <ul className="space-y-0.5 text-xs leading-tight">
                      {cat.boards.map((b) => (
                        <li key={b.id}>
                          <Link
                            href={`/catalog?b=${b.shortcode}`}
                            onMouseEnter={() => setHoveredBoard(b)}
                            className={`group flex items-baseline gap-1 py-0.5 transition-colors ${themeStyles.boardLink}`}
                            title={`/${b.shortcode}/ - ${b.name}\n${b.description}`}
                          >
                            <span className="font-semibold">{b.name}</span>
                            <span className="text-[10px] font-mono opacity-50 group-hover:opacity-90">
                              /{b.shortcode}/
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 4. INTERACTIVE BOARD PREVIEW HERO */}
        <div className={`border rounded-[3px] shadow-2xs overflow-hidden transition-all duration-200 ${themeStyles.boxBorder}`}>
          <div className={`py-1.5 px-3 flex items-center justify-between text-xs font-bold uppercase tracking-wide ${themeStyles.boxHeader}`}>
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-3 w-3" />
              Board Preview Hero
            </span>
            <span className="text-[10px] font-mono font-normal opacity-70">
              /{activeHeroBoard.shortcode}/
            </span>
          </div>

          <div className="p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <BoardPlaceholderArt board={activeHeroBoard} />
            <div className="flex-1 space-y-1.5 min-w-0">
              <div className="flex flex-wrap items-baseline gap-2">
                <h3 className="text-base sm:text-lg font-bold font-serif">
                  /{activeHeroBoard.shortcode}/ - {activeHeroBoard.name}
                </h3>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/5 border border-current/10">
                  {activeHeroBoard.domain} &bull; {activeHeroBoard.subCategory}
                </span>
              </div>

              <p className="text-xs opacity-80 leading-relaxed">
                {activeHeroBoard.description}
              </p>

              {activeHeroBoard.tags && activeHeroBoard.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-0.5">
                  {activeHeroBoard.tags.slice(0, 5).map((tag, tIdx) => (
                    <span key={tIdx} className="text-[10px] font-mono opacity-60">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="pt-2 flex items-center gap-3">
                <Link
                  href={`/catalog?b=${activeHeroBoard.shortcode}`}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-xs transition-colors flex items-center gap-1.5 shadow-2xs ${
                    theme === "classic"
                      ? "bg-[#800000] text-white hover:bg-[#990000]"
                      : theme === "twitter"
                      ? "bg-[#1DA1F2] text-white hover:bg-[#1a91da]"
                      : "bg-emerald-700 text-white hover:bg-emerald-800"
                  }`}
                >
                  <span>Enter /{activeHeroBoard.shortcode}/ Board</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
                <span className="text-[10.5px] opacity-60 italic hidden sm:inline">
                  Hover over any board above to preview
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 5. FOOTER (Early 2000s 4chan.org Bottom Nav & Legal Disclaimer) */}
        <footer className={`pt-2 pb-8 text-center text-xs space-y-3 ${themeStyles.footer}`}>
          {/* Repeated Global Shortcode Links */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 text-[11px]">
            <span className="font-mono">
              <span className={themeStyles.topNavBrackets}>[ </span>
              {visibleBoards.map((b, i) => (
                <React.Fragment key={b.id}>
                  <Link
                    href={`/catalog?b=${b.shortcode}`}
                    className={themeStyles.topNavLink}
                  >
                    {b.shortcode}
                  </Link>
                  {i < visibleBoards.length - 1 && (
                    <span className="opacity-40 mx-0.5">/</span>
                  )}
                </React.Fragment>
              ))}
              <span className={themeStyles.topNavBrackets}> ]</span>
            </span>
          </div>

          {/* Text Nav Links */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
            <Link href="/" className={themeStyles.footerLink}>
              Home
            </Link>
            <span>-</span>
            <Link href="/catalog" className={themeStyles.footerLink}>
              Catalog
            </Link>
            <span>-</span>
            <button onClick={() => setIsNewBoardOpen(true)} className={`${themeStyles.footerLink} cursor-pointer`}>
              Create Board
            </button>
            <span>-</span>
            <a href="#rules" className={themeStyles.footerLink}>
              Rules
            </a>
            <span>-</span>
            <a href="#faq" className={themeStyles.footerLink}>
              FAQ
            </a>
            <span>-</span>
            <a href="#feedback" className={themeStyles.footerLink}>
              Feedback
            </a>
          </div>

          {/* Early 2000s Disclaimer */}
          <p className="text-[11px] opacity-75 max-w-lg mx-auto">
            All trademarks and copyrights on this page are owned by their respective parties.
            Images uploaded are the responsibility of the poster.
          </p>
        </footer>
      </main>

      {/* ================= MODAL: CREATE CUSTOM BOARD ================= */}
      {isNewBoardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className={`w-full max-w-lg rounded-2xl border p-5 shadow-2xl ${themeStyles.modal}`}>
            <div className="flex items-center justify-between border-b border-current/10 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm">Create New Custom Board</span>
                <span className="text-[11px] opacity-60">(Like a Subreddit)</span>
              </div>
              <button
                onClick={() => setIsNewBoardOpen(false)}
                className="opacity-60 hover:opacity-100 p-1 rounded-full"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBoard} className="space-y-3 text-xs">
              {boardError && (
                <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600 text-xs">
                  {boardError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 opacity-80">Shortcode / Slug (e.g. &quot;keeb&quot;)</label>
                  <div className="flex items-center rounded-lg border border-current/20 px-2 py-1.5 bg-white/5">
                    <span className="opacity-50 font-mono">/</span>
                    <input
                      type="text"
                      value={boardShortcode}
                      onChange={(e) => setBoardShortcode(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                      placeholder="shortcode"
                      required
                      className="w-full bg-transparent outline-none font-mono font-bold px-1"
                    />
                    <span className="opacity-50 font-mono">/</span>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1 opacity-80">Board Name</label>
                  <input
                    type="text"
                    value={boardName}
                    onChange={(e) => setBoardName(e.target.value)}
                    placeholder="e.g. Mechanical Keyboards"
                    required
                    className="w-full rounded-lg border border-current/20 px-3 py-1.5 outline-none focus:border-[#1DA1F2] bg-white/5"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 opacity-80">Domain / Category</label>
                <select
                  value={boardDomain}
                  onChange={(e) => setBoardDomain(e.target.value)}
                  className="w-full rounded-lg border border-current/20 px-3 py-1.5 outline-none focus:border-[#1DA1F2] bg-white/5"
                >
                  <option value="Technology">Technology</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Aesthetics">Aesthetics</option>
                  <option value="Culture">Culture</option>
                  <option value="Creative">Creative</option>
                  <option value="Hobbies">Hobbies</option>
                  <option value="Community">Community / Other</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1 opacity-80">Description</label>
                <textarea
                  value={boardDescription}
                  onChange={(e) => setBoardDescription(e.target.value)}
                  rows={2}
                  placeholder="What is this board about?"
                  className="w-full rounded-lg border border-current/20 px-3 py-1.5 outline-none focus:border-[#1DA1F2] bg-white/5"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 opacity-80">Tags (comma separated)</label>
                <input
                  type="text"
                  value={boardTags}
                  onChange={(e) => setBoardTags(e.target.value)}
                  placeholder="hardware, switches, keycaps, modding"
                  className="w-full rounded-lg border border-current/20 px-3 py-1.5 outline-none focus:border-[#1DA1F2] bg-white/5"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-current/10">
                <button
                  type="button"
                  onClick={() => setIsNewBoardOpen(false)}
                  className="px-3 py-1.5 rounded-lg opacity-70 hover:opacity-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingBoard}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg font-bold text-white transition-all ${
                    theme === "twitter"
                      ? "bg-[#1DA1F2] hover:bg-[#1a91da]"
                      : theme === "classic"
                      ? "bg-[#800000] hover:bg-[#660000]"
                      : "bg-emerald-600 hover:bg-emerald-700"
                  } ${isSubmittingBoard ? "opacity-50" : ""}`}
                >
                  <FolderPlus className="h-3.5 w-3.5" />
                  <span>{isSubmittingBoard ? "Creating..." : "Create Board"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
