"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Sun,
  Flame,
  Clock,
  MessageSquare,
  Sparkles,
  ArrowLeft,
  Plus,
  Bot,
  X,
  Send,
  FolderPlus,
  RefreshCw,
} from "lucide-react";

function TwitterIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.936 9.936 0 0024 4.59z" />
    </svg>
  );
}

import { getBoard } from "@/lib/boards";
import {
  fetchThreads,
  createNewThread,
  createCustomBoard,
  triggerBot,
  Thread,
} from "@/lib/client-api";

type CardSize = "compact" | "medium" | "large";
type ThemeMode = "classic" | "twitter" | "light";

function CatalogInner() {
  const searchParams = useSearchParams();
  const boardParam = searchParams.get("b") || searchParams.get("board") || "mc";
  const currentBoard = useMemo(() => getBoard(boardParam), [boardParam]);

  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [cardSize, setCardSize] = useState<CardSize>("medium");
  const [theme, setTheme] = useState<ThemeMode>("twitter"); // Default to Twitter theme
  const [sortBy, setSortBy] = useState<"bump" | "replies" | "recent">("bump");

  // Modals
  const [isNewThreadOpen, setIsNewThreadOpen] = useState(false);
  const [isNewBoardOpen, setIsNewBoardOpen] = useState(false);
  const [botLoading, setBotLoading] = useState(false);

  // New Thread Form State
  const [newTitle, setNewTitle] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newComment, setNewComment] = useState("");
  const [newHasImage, setNewHasImage] = useState(true);
  const [isSubmittingThread, setIsSubmittingThread] = useState(false);
  const [threadError, setThreadError] = useState("");

  // New Board Form State
  const [boardShortcode, setBoardShortcode] = useState("");
  const [boardName, setBoardName] = useState("");
  const [boardDomain, setBoardDomain] = useState("Technology");
  const [boardDescription, setBoardDescription] = useState("");
  const [boardTags, setBoardTags] = useState("");
  const [isSubmittingBoard, setIsSubmittingBoard] = useState(false);
  const [boardError, setBoardError] = useState("");

  // Load threads from live storage
  const loadThreads = async () => {
    setLoading(true);
    try {
      const live = await fetchThreads(currentBoard.shortcode);
      setThreads(live);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadThreads();
  }, [currentBoard.shortcode]);

  // Filtering and sorting
  const filteredPosts = useMemo(() => {
    let result = threads.filter((post) => {
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
      result = [...result].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else {
      // Bump order: most recently created or highest post count
      result = [...result].sort((a, b) => b.id - a.id);
    }
    return result;
  }, [threads, searchQuery, sortBy]);

  // Create Thread Handler
  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) {
      setThreadError("Please enter a comment or opening text.");
      return;
    }
    setIsSubmittingThread(true);
    setThreadError("");

    try {
      await createNewThread({
        boardId: currentBoard.shortcode,
        title: newTitle.trim(),
        comment: newComment.trim(),
        user: {
          username: newUsername.trim() || "Anonymous",
        },
        hasImage: newHasImage,
      });

      setNewTitle("");
      setNewComment("");
      setIsNewThreadOpen(false);
      await loadThreads();
    } catch (err: any) {
      setThreadError(err.message || "Failed to create thread.");
    } finally {
      setIsSubmittingThread(false);
    }
  };

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
      // Navigate to new board catalog
      window.location.href = `/catalog?b=${board.shortcode}`;
    } catch (err: any) {
      setBoardError(err.message || "Failed to create board.");
    } finally {
      setIsSubmittingBoard(false);
    }
  };

  // Bot Trigger Handler
  const handleTriggerBot = async () => {
    setBotLoading(true);
    try {
      await triggerBot("thread", { boardId: currentBoard.shortcode });
      await loadThreads();
    } catch (err) {
      console.error("Bot action error:", err);
    } finally {
      setBotLoading(false);
    }
  };

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

  const modalBg = {
    classic: "bg-[#FFFFEE] border-[#800000] text-black",
    twitter: "bg-white border-[#CCD6DD] text-[#14171A] shadow-xl",
    light: "bg-white border-slate-300 text-slate-900 shadow-xl",
  }[theme];

  return (
    <div className={`min-h-screen ${themeBg} flex flex-col font-sans transition-colors duration-150`}>
      {/* Top Banner / Board Header */}
      <header className={`sticky top-0 z-30 border-b backdrop-blur-md px-4 py-2.5 shadow-sm ${headerBg}`}>
        <div className="mx-auto flex max-w-[1920px] flex-wrap items-center justify-between gap-3">
          {/* Board Title & Brand */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="group flex items-center gap-1.5 opacity-80 hover:opacity-100 text-xs font-semibold mr-1"
              title="Return to Home Page (All Boards)"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span className="hidden sm:inline">[Index]</span>
            </Link>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span
                  className={`font-mono text-sm sm:text-base font-bold tracking-tight ${
                    theme === "twitter"
                      ? "text-[#1DA1F2]"
                      : theme === "classic"
                      ? "text-[#800000]"
                      : "text-emerald-700"
                  }`}
                >
                  /{currentBoard.shortcode}/
                </span>
                <span className="text-xs sm:text-sm font-semibold opacity-90 truncate max-w-[200px] sm:max-w-none">
                  {currentBoard.name}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-current/10 opacity-70 hidden md:inline">
                  {currentBoard.domain}
                </span>
              </div>
              <p className="text-[11px] opacity-60 line-clamp-1 max-w-sm sm:max-w-md hidden md:block">
                {currentBoard.description}
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative min-w-[180px] flex-1 max-w-xs sm:max-w-md">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 opacity-50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search /${currentBoard.shortcode}/ catalog...`}
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

          {/* Action Buttons: New Thread, New Board, Bot Seed */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setIsNewThreadOpen(true)}
              className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold shadow-xs transition-all ${
                theme === "twitter"
                  ? "bg-[#1DA1F2] text-white hover:bg-[#1a91da]"
                  : theme === "classic"
                  ? "bg-[#800000] text-white hover:bg-[#660000]"
                  : "bg-emerald-600 text-white hover:bg-emerald-700"
              }`}
              title="Start a new discussion thread"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>New Thread</span>
            </button>

            <button
              onClick={() => setIsNewBoardOpen(true)}
              className="flex items-center gap-1 rounded-full border border-current/25 px-2.5 py-1 text-xs font-medium opacity-80 hover:opacity-100 transition-all"
              title="Create a new custom board (like subreddits)"
            >
              <FolderPlus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">New Board</span>
            </button>

            <button
              onClick={handleTriggerBot}
              disabled={botLoading}
              className={`flex items-center gap-1 rounded-full border border-purple-400/40 bg-purple-500/10 px-2.5 py-1 text-xs font-medium text-purple-700 dark:text-purple-400 hover:bg-purple-500/20 transition-all ${
                botLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              title="Cold Start: Trigger an agent bot to post a thread"
            >
              <Bot className={`h-3.5 w-3.5 ${botLoading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">{botLoading ? "Bot Posting..." : "Bot Seed"}</span>
            </button>
          </div>

          {/* Controls: Sorting, Size, Theme */}
          <div className="flex items-center gap-2 text-xs">
            {/* Sort Buttons */}
            <div className="flex items-center rounded-full border border-current/20 p-0.5">
              <button
                onClick={() => setSortBy("bump")}
                className={`flex items-center gap-1 rounded-full px-2 py-1 transition-all ${
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
                className={`flex items-center gap-1 rounded-full px-2 py-1 transition-all ${
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
                className={`flex items-center gap-1 rounded-full px-2 py-1 transition-all ${
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
              className="flex items-center gap-1.5 rounded-full border border-current/20 px-2.5 py-1 text-xs font-medium opacity-80 hover:opacity-100 transition-all"
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
        {loading ? (
          <div className="py-24 text-center">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto opacity-50 mb-3" />
            <p className="text-xs font-mono opacity-60">Loading /{currentBoard.shortcode}/ threads...</p>
          </div>
        ) : threads.length === 0 ? (
          /* AUTHENTIC EMPTY BOARD STATE */
          <div className="py-20 sm:py-28 text-center max-w-lg mx-auto px-4">
            <div className="mb-4 inline-flex items-center justify-center p-3 rounded-full bg-current/5 border border-current/10">
              <MessageSquare className="h-8 w-8 opacity-40" />
            </div>
            <h2 className="text-base sm:text-lg font-bold mb-2">
              There are currently no threads on /{currentBoard.shortcode}/
            </h2>
            <p className="text-xs sm:text-sm opacity-70 mb-6 leading-relaxed">
              This board is live and completely clean of hardcoded placeholders. Be the first to start a discussion, or let a bot agent kick off the conversation!
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setIsNewThreadOpen(true)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-white shadow-md transition-all ${
                  theme === "twitter"
                    ? "bg-[#1DA1F2] hover:bg-[#1a91da]"
                    : theme === "classic"
                    ? "bg-[#800000] hover:bg-[#660000]"
                    : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                <Plus className="h-4 w-4" />
                <span>Start First Thread</span>
              </button>

              <button
                onClick={handleTriggerBot}
                disabled={botLoading}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium border border-purple-400 bg-purple-50 text-purple-700 hover:bg-purple-100 transition-all dark:bg-purple-950/30 dark:text-purple-300"
              >
                <Bot className={`h-4 w-4 ${botLoading ? "animate-spin" : ""}`} />
                <span>{botLoading ? "Bot Generating..." : "Simulate Bot Poster"}</span>
              </button>
            </div>
          </div>
        ) : filteredPosts.length === 0 ? (
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
                    className={`relative overflow-hidden rounded-lg bg-gradient-to-br ${post.colorTone || "from-slate-700 to-zinc-900"} flex flex-col items-center justify-center border border-black/10 shadow-sm transition-transform duration-150 group-hover:scale-[1.03] group-hover:shadow-md ${post.aspect?.ratioClass || "aspect-[16/9] w-full max-h-[140px]"}`}
                  >
                    {/* R / I metadata tag overlay */}
                    <div className="absolute top-1 right-1 rounded-full bg-black/75 px-1.5 py-0.5 text-[8px] font-mono text-white backdrop-blur-[2px]">
                      R: {post.replies} / I: {post.images}
                    </div>

                    <span className="text-[9px] uppercase font-mono tracking-wider opacity-70 text-zinc-300">
                      IMG #{post.id}
                    </span>
                    <span className="text-xl sm:text-2xl font-black tracking-tight font-mono text-white">
                      #{post.id}
                    </span>
                    <span className="text-[8.5px] font-mono opacity-70 text-zinc-300">
                      {post.aspect?.dimLabel || "1920x1080"}
                    </span>
                  </div>
                </div>

                {/* Author Avatar + Name horizontally aligned */}
                <div className="flex items-center gap-1.5 text-[11px] mb-1 opacity-80 group-hover:opacity-100">
                  <div
                    className={`w-4 h-4 rounded-full bg-gradient-to-br ${post.user.avatarBg || "from-blue-600 to-indigo-800"} flex items-center justify-center text-[7px] font-bold text-white shadow-xs shrink-0`}
                  >
                    {post.user.initials || "AN"}
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
        <p>
          oomfit Catalog • Board /{currentBoard.shortcode}/ • {threads.length} Active Threads •{" "}
          <Link href="/" className="underline hover:opacity-100">
            Return to Boards Index
          </Link>
        </p>
      </footer>

      {/* ================= MODAL: CREATE THREAD ================= */}
      {isNewThreadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className={`w-full max-w-lg rounded-2xl border p-5 shadow-2xl ${modalBg}`}>
            <div className="flex items-center justify-between border-b border-current/10 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm">Create New Thread</span>
                <span className="text-xs font-mono opacity-60">/{currentBoard.shortcode}/</span>
              </div>
              <button
                onClick={() => setIsNewThreadOpen(false)}
                className="opacity-60 hover:opacity-100 p-1 rounded-full"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateThread} className="space-y-3 text-xs">
              {threadError && (
                <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600 text-xs">
                  {threadError}
                </div>
              )}

              <div>
                <label className="block font-semibold mb-1 opacity-80">Subject / Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Thread subject..."
                  className="w-full rounded-lg border border-current/20 px-3 py-2 outline-none focus:border-[#1DA1F2] bg-white/5"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 opacity-80">Name / Handle</label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="Anonymous (or your handle)"
                  className="w-full rounded-lg border border-current/20 px-3 py-2 outline-none focus:border-[#1DA1F2] bg-white/5"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 opacity-80">Comment / Body (Supports &gt;greentext)</label>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={4}
                  placeholder="Write your discussion post here. Lines starting with > turn green..."
                  required
                  className="w-full rounded-lg border border-current/20 px-3 py-2 outline-none focus:border-[#1DA1F2] bg-white/5 font-mono text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="hasImg"
                  checked={newHasImage}
                  onChange={(e) => setNewHasImage(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="hasImg" className="opacity-80 cursor-pointer">
                  Attach image file placeholder
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-current/10">
                <button
                  type="button"
                  onClick={() => setIsNewThreadOpen(false)}
                  className="px-3 py-1.5 rounded-lg opacity-70 hover:opacity-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingThread}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg font-bold text-white transition-all ${
                    theme === "twitter"
                      ? "bg-[#1DA1F2] hover:bg-[#1a91da]"
                      : theme === "classic"
                      ? "bg-[#800000] hover:bg-[#660000]"
                      : "bg-emerald-600 hover:bg-emerald-700"
                  } ${isSubmittingThread ? "opacity-50" : ""}`}
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{isSubmittingThread ? "Posting..." : "Post Thread"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: CREATE CUSTOM BOARD ================= */}
      {isNewBoardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className={`w-full max-w-lg rounded-2xl border p-5 shadow-2xl ${modalBg}`}>
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

export default function CatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center font-mono text-sm opacity-60 bg-[#E6ECF0]">
          Loading catalog...
        </div>
      }
    >
      <CatalogInner />
    </Suspense>
  );
}
