"use client";

import React, { useState, useMemo, use, Suspense, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowDown,
  ArrowUp,
  Sun,
  Sparkles,
  MessageSquare,
  Image as ImageIcon,
  Send,
  Maximize2,
  Minimize2,
  X,
  Bot,
  RefreshCw,
} from "lucide-react";

function TwitterIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.936 9.936 0 0024 4.59z" />
    </svg>
  );
}

import { UserProfile } from "@/lib/data";
import { ProfileBadge } from "@/lib/user";
import { fetchThread, postReply, triggerBot, Thread, ThreadReply } from "@/lib/client-api";

type ThemeMode = "classic" | "twitter" | "light";

interface UnifiedPost {
  postNumber: number;
  user: UserProfile;
  isOp: boolean;
  timestamp: string;
  title?: string;
  file?: {
    name: string;
    size: string;
    dimensions: string;
    ratioClass: string;
    colorTone: string;
    imageNum: number;
  };
  comments: string[];
  replyTo: number[];
}

interface HoverState {
  postNumber: number;
  x: number;
  y: number;
}

interface ThreadPageProps {
  params: Promise<{ id: string }>;
}

interface ThemeStyles {
  pageBg: string;
  topBar: string;
  replyBox: string;
  inlinedBox: string;
  previewBox: string;
  subjectText: string;
  nameText: string;
  postNumber: string;
  quoteLink: string;
  greenText: string;
  fileInfo: string;
  metaBar: string;
  inlineBorder: string;
  tweetButton: string;
}

interface PostCardProps {
  post: UnifiedPost;
  isInlined?: boolean;
  onCloseInline?: () => void;
  ancestorChain?: number[];
  themeStyles: ThemeStyles;
  postsMap: Map<number, UnifiedPost>;
  getBacklinks: (postNumber: number) => ThreadReply[];
  expandedImages: Record<number, boolean>;
  toggleImageExpand: (id: number) => void;
  handlePostNumberClick: (postNumber: number) => void;
  handleQuoteMouseEnter: (postNumber: number, e: React.MouseEvent) => void;
  handleQuoteMouseLeave: () => void;
  dismissHover: () => void;
}

// STABLE MODULE-LEVEL POSTCARD COMPONENT
function PostCard({
  post,
  isInlined = false,
  onCloseInline,
  ancestorChain = [],
  themeStyles,
  postsMap,
  getBacklinks,
  expandedImages,
  toggleImageExpand,
  handlePostNumberClick,
  handleQuoteMouseEnter,
  handleQuoteMouseLeave,
  dismissHover,
}: PostCardProps) {
  const [inlinedPosts, setInlinedPosts] = useState<number[]>([]);

  const handleToggleInline = (targetNum: number) => {
    dismissHover();
    setInlinedPosts((prev) =>
      prev.includes(targetNum) ? prev.filter((n) => n !== targetNum) : [...prev, targetNum]
    );
  };

  const currentChain = [...ancestorChain, post.postNumber];
  const backlinks = getBacklinks(post.postNumber);
  const isExpanded = post.file ? Boolean(expandedImages[post.file.imageNum]) : false;

  return (
    <article
      id={`p${post.postNumber}`}
      className={`text-xs transition-colors duration-100 ${
        isInlined
          ? `my-1.5 p-2.5 ${themeStyles.inlinedBox} ${themeStyles.inlineBorder}`
          : post.isOp
          ? "w-full"
          : `inline-block max-w-3xl p-3 my-1.5 ${themeStyles.replyBox}`
      }`}
    >
      {/* 1. POST HEADER (Identity, Time, Post No, Backlinks) */}
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 mb-2 text-[11px] leading-tight">
        {isInlined && onCloseInline && (
          <button
            onClick={onCloseInline}
            className="font-mono text-[10px] text-red-500 font-bold hover:underline mr-1"
            title="Close inlined quote"
          >
            [close]
          </button>
        )}

        <div className="flex items-center gap-1.5 shrink-0">
          <div
            className={`w-4.5 h-4.5 rounded-full bg-gradient-to-br ${post.user.avatarBg || "from-blue-600 to-indigo-800"} flex items-center justify-center text-[7.5px] font-bold text-white shadow-xs`}
          >
            {post.user.initials || "AN"}
          </div>
          <span className={themeStyles.nameText}>{post.user.username}</span>
          <span className="opacity-50 text-[10px] font-mono">@{post.user.username.toLowerCase()}</span>
        </div>

        {post.isOp && (
          <span className="rounded-full bg-sky-500/15 text-[#1DA1F2] px-1.5 py-0.2 text-[9px] font-mono font-semibold">
            OP
          </span>
        )}

        {post.title && <span className={`${themeStyles.subjectText} font-bold mr-1`}>{post.title}</span>}

        <span className="opacity-50 text-[10px] font-mono">{post.timestamp}</span>

        <button
          onClick={() => handlePostNumberClick(post.postNumber)}
          className={`font-mono font-semibold ${themeStyles.postNumber}`}
          title="Click to quote this post"
        >
          No. {post.postNumber}
        </button>

        {/* Backlinks */}
        {backlinks.length > 0 && (
          <div className="flex items-center gap-1.5 pl-1.5 border-l border-current/20">
            <span className="text-[10px] opacity-40 font-mono">replies:</span>
            <div className="flex items-center -space-x-1">
              {backlinks.map((bl) => (
                <button
                  key={bl.postNumber}
                  onClick={() => handleToggleInline(bl.postNumber)}
                  onMouseEnter={(e) => handleQuoteMouseEnter(bl.postNumber, e)}
                  onMouseLeave={handleQuoteMouseLeave}
                  className={`w-4 h-4 rounded-full bg-gradient-to-br ${bl.user.avatarBg || "from-blue-600 to-indigo-800"} flex items-center justify-center text-[7px] font-bold text-white border border-white shadow-xs hover:scale-125 transition-transform z-10`}
                  title={`Reply from @${bl.user.username} (>>${bl.postNumber})`}
                >
                  {bl.user.initials || "AN"}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. INLINED POSTS */}
      {inlinedPosts.length > 0 && (
        <div className="my-2 space-y-2 pl-2 border-l-2 border-current/15">
          {inlinedPosts.map((targetNum) => {
            const targetPost = postsMap.get(targetNum);
            if (!targetPost) {
              return (
                <div key={targetNum} className="text-[10px] font-mono text-red-500 p-1">
                  Post No. {targetNum} not found
                </div>
              );
            }

            if (currentChain.includes(targetNum)) {
              return (
                <div key={targetNum} className="text-[10px] font-mono opacity-50 p-1">
                  [Cyclic Quote &gt;&gt;{targetNum}]
                </div>
              );
            }

            return (
              <PostCard
                key={targetNum}
                post={targetPost}
                isInlined={true}
                ancestorChain={currentChain}
                onCloseInline={() => handleToggleInline(targetNum)}
                themeStyles={themeStyles}
                postsMap={postsMap}
                getBacklinks={getBacklinks}
                expandedImages={expandedImages}
                toggleImageExpand={toggleImageExpand}
                handlePostNumberClick={handlePostNumberClick}
                handleQuoteMouseEnter={handleQuoteMouseEnter}
                handleQuoteMouseLeave={handleQuoteMouseLeave}
                dismissHover={dismissHover}
              />
            );
          })}
        </div>
      )}

      {/* 3. FILE INFO BAR */}
      {post.file && (
        <div className={`text-[10px] font-mono mb-1.5 flex items-center gap-1.5 ${themeStyles.fileInfo}`}>
          <span>File:</span>
          <span className="font-semibold underline cursor-pointer hover:opacity-100">{post.file.name}</span>
          <span>({post.file.size}, {post.file.dimensions})</span>
        </div>
      )}

      {/* 4. MEDIA + COMMENT BODY CONTAINER */}
      <div className="flex flex-col sm:flex-row items-start gap-3">
        {post.file && (
          <div className="shrink-0 max-w-full">
            <div
              onClick={() => toggleImageExpand(post.file!.imageNum)}
              className={`relative cursor-pointer overflow-hidden rounded-lg bg-gradient-to-br ${post.file.colorTone} flex flex-col items-center justify-center border border-black/10 shadow-xs transition-all ${
                isExpanded ? "w-full max-w-[500px] h-auto p-8" : "w-[125px] h-[95px]"
              }`}
              title="Click to expand / collapse media"
            >
              <span className="text-[8px] uppercase font-mono tracking-wider opacity-60 text-white">
                IMG #{post.file.imageNum}
              </span>
              <span className="text-base font-black font-mono text-white">#{post.file.imageNum}</span>
              <span className="text-[8px] font-mono opacity-60 text-white">{post.file.dimensions}</span>

              <div className="absolute bottom-1 right-1 p-1 rounded-full bg-black/40 text-white hover:bg-black/60">
                {isExpanded ? <Minimize2 className="h-2.5 w-2.5" /> : <Maximize2 className="h-2.5 w-2.5" />}
              </div>
            </div>
          </div>
        )}

        {/* Comment Text with Greentext syntax and Quoting back-buttons */}
        <div className="flex-1 space-y-1 text-xs leading-relaxed font-sans">
          {post.comments.map((line, idx) => {
            const isGreen = line.startsWith(">");
            const quoteMatch = line.match(/^>>(\d+)/);

            if (quoteMatch) {
              const targetNum = parseInt(quoteMatch[1], 10);
              const targetPost = postsMap.get(targetNum);
              const remainder = line.slice(quoteMatch[0].length);

              return (
                <div key={idx} className="flex flex-wrap items-center gap-1.5">
                  <button
                    onClick={() => handleToggleInline(targetNum)}
                    onMouseEnter={(e) => handleQuoteMouseEnter(targetNum, e)}
                    onMouseLeave={handleQuoteMouseLeave}
                    className={`inline-flex items-center gap-1 font-mono font-semibold hover:underline ${themeStyles.quoteLink}`}
                  >
                    {targetPost && (
                      <span
                        className={`w-3.5 h-3.5 rounded-full bg-gradient-to-br ${targetPost.user.avatarBg || "from-blue-600 to-indigo-800"} flex items-center justify-center text-[6px] font-bold text-white shadow-xs`}
                      >
                        {targetPost.user.initials || "AN"}
                      </span>
                    )}
                    <span>&gt;&gt;{targetNum}</span>
                    <span className="text-[9px] opacity-70">↴</span>
                  </button>
                  {remainder && (
                    <span className={isGreen ? `${themeStyles.greenText} font-mono` : ""}>{remainder}</span>
                  )}
                </div>
              );
            }

            return (
              <p key={idx} className={isGreen ? `${themeStyles.greenText} font-mono` : ""}>
                {line}
              </p>
            );
          })}
        </div>
      </div>
    </article>
  );
}

function ThreadContent({ params }: ThreadPageProps) {
  const resolvedParams = use(params);
  const threadId = parseInt(resolvedParams.id || "1", 10) || 1;

  const [theme, setTheme] = useState<ThemeMode>("twitter"); // Default to Twitter theme
  const [expandedImages, setExpandedImages] = useState<Record<number, boolean>>({});
  const [quickReplyText, setQuickReplyText] = useState("");
  const [replyUsername, setReplyUsername] = useState("");
  const [replyHasImage, setReplyHasImage] = useState(false);
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [botLoading, setBotLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  // Thread live state
  const [threadState, setThreadState] = useState<{ op: Thread; replies: ThreadReply[] } | null>(null);

  // Hover state for floating preview tooltip
  const [hoverState, setHoverState] = useState<HoverState | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const loadThread = async () => {
    setLoading(true);
    try {
      const data = await fetchThread(threadId);
      setThreadState(data);
    } catch (err) {
      console.error("Failed to load thread:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadThread();
  }, [threadId]);

  const op = threadState?.op;
  const replies = useMemo(() => threadState?.replies || [], [threadState]);

  // Build unified lookup map for any post (OP or reply)
  const postsMap = useMemo(() => {
    const map = new Map<number, UnifiedPost>();
    if (!op) return map;

    // OP
    map.set(op.threadNumber, {
      postNumber: op.threadNumber,
      user: op.user,
      isOp: true,
      timestamp: op.timestamp,
      title: op.title,
      file: op.file,
      comments: op.comments,
      replyTo: [],
    });

    // Replies
    replies.forEach((r) => {
      map.set(r.postNumber, {
        postNumber: r.postNumber,
        user: r.user,
        isOp: false,
        timestamp: r.timestamp,
        file: r.file,
        comments: r.comments || [],
        replyTo: r.replyTo || [],
      });
    });

    return map;
  }, [op, replies]);

  const getBacklinks = (targetPostNumber: number) => {
    return replies.filter((r) => r.replyTo?.includes(targetPostNumber));
  };

  const toggleImageExpand = (imgId: number) => {
    setExpandedImages((prev) => ({ ...prev, [imgId]: !prev[imgId] }));
  };

  const handlePostNumberClick = (postNumber: number) => {
    setQuickReplyText((prev) => (prev ? `${prev}\n>>${postNumber}\n` : `>>${postNumber}\n`));
  };

  const dismissHover = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setHoverState(null);
  };

  // Hover Handlers for preview tooltip
  const handleQuoteMouseEnter = (postNumber: number, e: React.MouseEvent) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    const rect = e.currentTarget.getBoundingClientRect();
    setHoverState({
      postNumber,
      x: rect.left,
      y: rect.bottom + window.scrollY + 6,
    });
  };

  const handleQuoteMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoverState(null);
    }, 250);
  };

  const cancelHoverClose = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
  };

  // Submit Reply
  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickReplyText.trim()) return;

    setIsSubmittingReply(true);
    try {
      // Extract quote links from text
      const quotes = Array.from(quickReplyText.matchAll(/>>(\d+)/g)).map((m) => parseInt(m[1], 10));

      await postReply(threadId, {
        comment: quickReplyText.trim(),
        replyTo: Array.from(new Set(quotes)),
        user: {
          username: replyUsername.trim() || "Anonymous",
        },
        hasImage: replyHasImage,
      });

      setQuickReplyText("");
      await loadThread();
    } catch (err) {
      console.error("Failed to post reply:", err);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  // Bot Trigger Reply
  const handleBotReply = async () => {
    setBotLoading(true);
    try {
      await triggerBot("reply", { threadId });
      await loadThread();
    } catch (err) {
      console.error("Bot reply failed:", err);
    } finally {
      setBotLoading(false);
    }
  };

  // Themes: Twitter, Classic Yotsuba, Light
  const themeStyles: ThemeStyles = {
    twitter: {
      pageBg: "bg-[#E6ECF0] text-[#14171A]",
      topBar: "bg-white/95 border-[#E1E8ED] text-[#14171A] shadow-[0_1px_3px_rgba(0,0,0,0.06)]",
      replyBox: "bg-white border border-[#E1E8ED] text-[#14171A] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:border-[#CCD6DD]",
      inlinedBox: "bg-[#F5F8FA] border border-[#CCD6DD] text-[#14171A] rounded-lg shadow-xs",
      previewBox: "bg-white border-2 border-[#1DA1F2] text-[#14171A] rounded-xl shadow-2xl",
      subjectText: "text-[#14171A] font-extrabold",
      nameText: "text-[#14171A] font-bold hover:underline cursor-pointer",
      postNumber: "text-[#657786] hover:text-[#1DA1F2]",
      quoteLink: "text-[#1DA1F2] hover:underline cursor-pointer font-medium",
      greenText: "text-[#17BF63] font-medium",
      fileInfo: "text-[#657786]",
      metaBar: "border-[#E1E8ED] text-[#657786]",
      inlineBorder: "border-l-3 border-[#1DA1F2]",
      tweetButton: "bg-[#1DA1F2] hover:bg-[#1a91da] text-white font-bold rounded-full px-5 py-1.5 shadow-sm transition-all",
    },
    classic: {
      pageBg: "bg-[#FFFFEE] text-[#000000]",
      topBar: "bg-[#F0E0D6] border-[#D9BFB7] text-[#800000]",
      replyBox: "bg-[#F0E0D6] border-[#D9BFB7] text-[#000000] rounded-[3px]",
      inlinedBox: "bg-[#EADFD5] border-[#BFA8A0] text-[#000000] rounded-[3px]",
      previewBox: "bg-[#F0E0D6] border-[#800000] text-[#000000] shadow-xl rounded-[3px]",
      subjectText: "text-[#0F0C5D]",
      nameText: "text-[#117743] font-bold",
      postNumber: "text-[#000000]/60 hover:text-[#D00]",
      quoteLink: "text-[#D00] hover:underline cursor-pointer font-medium",
      greenText: "text-[#789922]",
      fileInfo: "text-[#707070]",
      metaBar: "border-[#D9BFB7] text-[#707070]",
      inlineBorder: "border-l-2 border-[#800000]/60",
      tweetButton: "bg-emerald-700 hover:bg-emerald-600 text-white font-medium rounded px-4 py-1.5 shadow transition-colors",
    },
    light: {
      pageBg: "bg-white text-slate-800",
      topBar: "bg-slate-100/90 border-slate-200 text-slate-800",
      replyBox: "bg-slate-50 border-slate-200 text-slate-800 shadow-sm rounded-md",
      inlinedBox: "bg-slate-100 border-slate-300 text-slate-900 rounded-md",
      previewBox: "bg-white border-2 border-emerald-600 text-slate-900 rounded-md shadow-2xl",
      subjectText: "text-slate-900 font-extrabold",
      nameText: "text-emerald-800 font-bold hover:underline cursor-pointer",
      postNumber: "text-slate-400 hover:text-emerald-700",
      quoteLink: "text-emerald-700 hover:underline cursor-pointer font-medium",
      greenText: "text-emerald-600 font-medium",
      fileInfo: "text-slate-500",
      metaBar: "border-slate-200 text-slate-500",
      inlineBorder: "border-l-3 border-emerald-600",
      tweetButton: "bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded px-4 py-1.5 shadow transition-colors",
    },
  }[theme];

  const previewPost = hoverState ? postsMap.get(hoverState.postNumber) : null;

  if (loading) {
    return (
      <div className={`min-h-screen ${themeStyles.pageBg} flex items-center justify-center font-mono text-xs opacity-70`}>
        <RefreshCw className="h-5 w-5 animate-spin mr-2" />
        <span>Loading thread #{threadId}...</span>
      </div>
    );
  }

  if (!op) {
    return (
      <div className={`min-h-screen ${themeStyles.pageBg} flex flex-col items-center justify-center text-center p-6`}>
        <h1 className="text-xl font-bold mb-2">Thread #{threadId} Not Found</h1>
        <p className="text-xs opacity-60 mb-6">
          This thread does not exist or has expired. All mock placeholders have been removed!
        </p>
        <Link
          href="/"
          className="px-4 py-2 rounded-full text-xs font-semibold bg-[#1DA1F2] text-white hover:bg-[#1a91da]"
        >
          [Return to Boards Index]
        </Link>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${themeStyles.pageBg} font-sans transition-colors duration-150`}>
      {/* Top Banner Navigation Bar */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-md px-4 py-2 shadow-xs ${themeStyles.topBar}`}>
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Left Navigation */}
          <div className="flex items-center gap-3">
            <ProfileBadge />
            <span className="opacity-30">|</span>
            <Link
              href={`/catalog?b=${op.boardId}`}
              className="flex items-center gap-1 font-semibold opacity-80 hover:opacity-100"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>[/{op.boardId}/ Catalog]</span>
            </Link>

            <span className="opacity-30">|</span>

            <span className="font-mono opacity-80">Thread #{op.id}</span>
          </div>

          {/* Quick Actions & Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleBotReply}
              disabled={botLoading}
              className={`flex items-center gap-1 rounded-full border border-purple-400/50 bg-purple-500/10 px-2.5 py-1 text-xs font-medium text-purple-700 dark:text-purple-400 hover:bg-purple-500/20 transition-all ${
                botLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              title="Cold Start: Let an automated agent bot post a reply"
            >
              <Bot className={`h-3.5 w-3.5 ${botLoading ? "animate-spin" : ""}`} />
              <span>{botLoading ? "Bot Replying..." : "Bot Reply"}</span>
            </button>

            <a href="#bottom" className="opacity-70 hover:opacity-100 flex items-center gap-1">
              <ArrowDown className="h-3 w-3" />
              <span>[Bottom]</span>
            </a>

            {/* Theme Toggle */}
            <button
              onClick={() => {
                const next: ThemeMode =
                  theme === "twitter" ? "classic" : theme === "classic" ? "light" : "twitter";
                setTheme(next);
              }}
              className="flex items-center gap-1.5 rounded-full border border-current/20 px-2.5 py-0.5 text-xs opacity-80 hover:opacity-100"
            >
              {theme === "twitter" ? (
                <>
                  <TwitterIcon className="h-3 w-3 text-[#1DA1F2] fill-[#1DA1F2]" />
                  <span className="font-semibold text-[#1DA1F2]">Twitter</span>
                </>
              ) : theme === "classic" ? (
                <>
                  <Sparkles className="h-3 w-3 text-amber-700" />
                  <span>Classic</span>
                </>
              ) : (
                <>
                  <Sun className="h-3 w-3 text-amber-600" />
                  <span>Light</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area (Strict Left-Aligned Layout) */}
      <main className="px-4 sm:px-6 py-4">
        {/* ================= ORIGINAL POST (OP) ================= */}
        {postsMap.get(op.threadNumber) && (
          <section className="mb-4">
            <PostCard
              post={postsMap.get(op.threadNumber)!}
              themeStyles={themeStyles}
              postsMap={postsMap}
              getBacklinks={getBacklinks}
              expandedImages={expandedImages}
              toggleImageExpand={toggleImageExpand}
              handlePostNumberClick={handlePostNumberClick}
              handleQuoteMouseEnter={handleQuoteMouseEnter}
              handleQuoteMouseLeave={handleQuoteMouseLeave}
              dismissHover={dismissHover}
            />
          </section>
        )}

        {/* ================= REPLIES ================= */}
        <section className="space-y-3 pt-2">
          {replies.length === 0 ? (
            <div className="py-6 text-xs opacity-60 italic">
              No replies yet. Be the first to reply or trigger a bot reply above!
            </div>
          ) : (
            replies.map((reply) => {
              const unified = postsMap.get(reply.postNumber);
              if (!unified) return null;

              return (
                <div key={reply.id} className="flex items-start gap-2">
                  <span className="text-xs opacity-30 select-none pt-2 hidden sm:inline">&gt;&gt;</span>
                  <PostCard
                    post={unified}
                    themeStyles={themeStyles}
                    postsMap={postsMap}
                    getBacklinks={getBacklinks}
                    expandedImages={expandedImages}
                    toggleImageExpand={toggleImageExpand}
                    handlePostNumberClick={handlePostNumberClick}
                    handleQuoteMouseEnter={handleQuoteMouseEnter}
                    handleQuoteMouseLeave={handleQuoteMouseLeave}
                    dismissHover={dismissHover}
                  />
                </div>
              );
            })
          )}
        </section>

        {/* Quick Reply Form (Left-aligned) */}
        <section className={`p-4 max-w-xl my-8 ${themeStyles.replyBox}`}>
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-current/10 text-xs">
            <span className="font-bold flex items-center gap-1.5">
              <MessageSquare className={`h-3.5 w-3.5 ${theme === "twitter" ? "text-[#1DA1F2]" : "text-emerald-700"}`} />
              Reply to Thread No. {op.threadNumber}
            </span>
            <span className="opacity-50 font-mono text-[10px]">Board /{op.boardId}/</span>
          </div>

          <form onSubmit={handleSubmitReply} className="space-y-3 text-xs">
            <div className="flex gap-2">
              <input
                type="text"
                value={replyUsername}
                onChange={(e) => setReplyUsername(e.target.value)}
                placeholder="Name / Handle (e.g. Anonymous)"
                className="w-full rounded-full border border-current/20 bg-transparent px-3 py-1.5 outline-none focus:border-[#1DA1F2] text-xs"
              />
            </div>

            <textarea
              rows={4}
              value={quickReplyText}
              onChange={(e) => setQuickReplyText(e.target.value)}
              placeholder="What's happening? (Quote posts with '>>No.', lines starting with '>' turn green)"
              required
              className="w-full rounded-xl border border-current/20 bg-transparent p-3 font-sans text-xs outline-none focus:border-[#1DA1F2]"
            />

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-1.5 text-[11px] opacity-70 hover:opacity-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={replyHasImage}
                  onChange={(e) => setReplyHasImage(e.target.checked)}
                  className="rounded"
                />
                <ImageIcon className="h-3.5 w-3.5" />
                <span>Attach Media</span>
              </label>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleBotReply}
                  disabled={botLoading}
                  className="px-3 py-1.5 rounded-full border border-purple-400/40 text-purple-600 text-xs hover:bg-purple-50 flex items-center gap-1"
                >
                  <Bot className="h-3 w-3" />
                  <span>Bot Reply</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmittingReply}
                  className={themeStyles.tweetButton}
                >
                  {isSubmittingReply ? "Posting..." : "Post Reply"}
                </button>
              </div>
            </div>
          </form>
        </section>

        {/* Bottom anchor and controls */}
        <div id="bottom" className={`pt-6 pb-12 flex items-center justify-between text-xs border-t ${themeStyles.metaBar} max-w-5xl`}>
          <Link
            href={`/catalog?b=${op.boardId}`}
            className={`flex items-center gap-1.5 font-semibold hover:underline ${
              theme === "twitter" ? "text-[#1DA1F2]" : "text-emerald-700"
            }`}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>[Return to /{op.boardId}/ Catalog]</span>
          </Link>

          <a href="#" className="opacity-75 hover:opacity-100 flex items-center gap-1">
            <ArrowUp className="h-3 w-3" />
            <span>[Top]</span>
          </a>
        </div>
      </main>

      {/* ================= FLOATING HOVER PREVIEW TOOLTIP ================= */}
      {hoverState && previewPost && (
        <div
          onMouseEnter={cancelHoverClose}
          onMouseLeave={handleQuoteMouseLeave}
          style={{
            position: "absolute",
            left: `${Math.min(hoverState.x, window.innerWidth - 380)}px`,
            top: `${hoverState.y}px`,
            zIndex: 60,
          }}
          className={`w-[360px] p-3 text-xs select-none pointer-events-auto ${themeStyles.previewBox}`}
        >
          <div className="flex items-baseline justify-between gap-1 mb-1.5 border-b border-current/10 pb-1.5">
            <div className="flex items-center gap-1.5">
              <div
                className={`w-4.5 h-4.5 rounded-full bg-gradient-to-br ${previewPost.user.avatarBg || "from-blue-600 to-indigo-800"} flex items-center justify-center text-[7.5px] font-bold text-white shadow-xs shrink-0`}
              >
                {previewPost.user.initials || "AN"}
              </div>
              <span className={themeStyles.nameText}>{previewPost.user.username}</span>
              {previewPost.isOp && (
                <span className="text-[9px] rounded-full bg-sky-500/15 text-[#1DA1F2] font-mono px-1.5 font-semibold">
                  OP
                </span>
              )}
              <span className="opacity-50 text-[10px] font-mono">• {previewPost.timestamp}</span>
              <span className="font-mono text-[10px] opacity-60">
                No. {previewPost.postNumber}
              </span>
            </div>
            <span className="text-[9px] font-mono opacity-50">[preview]</span>
          </div>

          {previewPost.file && (
            <div className="text-[9.5px] font-mono opacity-60 mb-1">
              File: {previewPost.file.name} ({previewPost.file.dimensions})
            </div>
          )}

          <div className="flex items-start gap-2 pt-0.5">
            {previewPost.file && (
              <div
                className={`w-[70px] h-[55px] shrink-0 rounded-lg bg-gradient-to-br ${previewPost.file.colorTone} flex items-center justify-center font-mono text-[10px] font-bold border border-black/10 text-white`}
              >
                #{previewPost.file.imageNum}
              </div>
            )}
            <div className="flex-1 space-y-0.5 text-[11.5px] leading-snug line-clamp-4">
              {previewPost.comments.map((line, idx) => (
                <p
                  key={idx}
                  className={line.startsWith(">") ? `${themeStyles.greenText} font-mono` : ""}
                >
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ThreadPage(props: ThreadPageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#E6ECF0] text-[#14171A] flex items-center justify-center text-sm font-mono">
          Loading thread...
        </div>
      }
    >
      <ThreadContent {...props} />
    </Suspense>
  );
}
