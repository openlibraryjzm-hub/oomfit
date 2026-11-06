"use client";

import React, { useState, useMemo, use, Suspense, useRef } from "react";
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
} from "lucide-react";

function TwitterIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.936 9.936 0 0024 4.59z" />
    </svg>
  );
}
import { getThreadData, UserProfile } from "@/lib/data";

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
  getBacklinks: (postNumber: number) => Array<{ postNumber: number }>;
  expandedImages: Record<number, boolean>;
  toggleImageExpand: (imgId: number) => void;
  handlePostNumberClick: (postNumber: number) => void;
  handleQuoteMouseEnter: (postNumber: number, e: React.MouseEvent) => void;
  handleQuoteMouseLeave: () => void;
  dismissHover: () => void;
}

// Module-level PostCard component to guarantee stable component identity
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
  // Inlined post numbers inside this card
  const [inlinedPosts, setInlinedPosts] = useState<number[]>([]);

  const toggleInlineQuote = (targetNum: number) => {
    // Dismiss any active hover preview tooltip immediately on click
    dismissHover();

    // Prevent circular recursion if post is already in current ancestor chain
    if (ancestorChain.includes(targetNum)) return;

    setInlinedPosts((prev) =>
      prev.includes(targetNum) ? prev.filter((n) => n !== targetNum) : [...prev, targetNum]
    );
  };

  const removeInlinedPost = (targetNum: number) => {
    setInlinedPosts((prev) => prev.filter((n) => n !== targetNum));
  };

  const backlinks = getBacklinks(post.postNumber);

  return (
    <article
      id={!isInlined ? `p${post.postNumber}` : undefined}
      className={`flex flex-col p-3 transition-all duration-150 ${
        isInlined ? themeStyles.inlinedBox : themeStyles.replyBox
      } ${isInlined ? "my-2 max-w-full" : "max-w-3xl"}`}
    >
      {/* Post Header: Small circular avatar first, horizontally aligned with username, post ID, and replier avatars */}
      <div className="flex flex-wrap items-center justify-between gap-x-2 text-xs mb-1.5">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {post.title && (
            <span className={`font-bold mr-0.5 ${themeStyles.subjectText}`}>
              {post.title}
            </span>
          )}

          {/* User Profile: Small circular avatar image + Name */}
          <div className="flex items-center gap-1.5">
            <div
              className={`w-5 h-5 rounded-full bg-gradient-to-br ${post.user.avatarBg} flex items-center justify-center text-[8px] font-bold text-white shadow-xs shrink-0 select-none ring-1 ring-black/10`}
              title={`User: @${post.user.username}`}
            >
              {post.user.initials}
            </div>
            <span className={themeStyles.nameText}>{post.user.username}</span>
            <span className="opacity-50 text-[11px] font-mono">@{post.user.username.toLowerCase()}</span>
          </div>

          {post.isOp && (
            <span className="text-[10px] rounded-full bg-sky-500/15 text-[#1DA1F2] font-mono px-2 py-0.2 font-semibold">
              OP
            </span>
          )}

          <span className="opacity-50 text-[11px] font-mono">• {post.timestamp}</span>

          <button
            onClick={() => handlePostNumberClick(post.postNumber)}
            className={`font-mono text-[11px] ${themeStyles.postNumber}`}
            title="Click to quote in reply box"
          >
            No. {post.postNumber}
          </button>

          {/* ================= HORIZONTALLY ALIGNED REPLIER AVATARS ================= */}
          {backlinks.length > 0 && (
            <div className="inline-flex items-center gap-1 pl-1.5 border-l border-current/20">
              <span className="text-[10px] font-mono opacity-50 select-none">replies:</span>
              <div className="inline-flex items-center -space-x-1 hover:space-x-1 transition-all">
                {backlinks.map((b) => {
                  const replierPost = postsMap.get(b.postNumber);
                  if (!replierPost) return null;
                  const isAlreadyInlined = inlinedPosts.includes(b.postNumber);

                  return (
                    <button
                      key={b.postNumber}
                      type="button"
                      onClick={() => toggleInlineQuote(b.postNumber)}
                      onMouseEnter={(e) => handleQuoteMouseEnter(b.postNumber, e)}
                      onMouseLeave={handleQuoteMouseLeave}
                      className={`relative rounded-full transition-transform hover:scale-125 hover:z-20 cursor-pointer ${
                        isAlreadyInlined
                          ? "ring-2 ring-[#1DA1F2] scale-110 z-10"
                          : "ring-1 ring-white/80 shadow-xs"
                      }`}
                      title={`${replierPost.user.username} (No. ${b.postNumber}) • Click to inline • Hover to preview`}
                    >
                      <div
                        className={`w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full bg-gradient-to-br ${replierPost.user.avatarBg} flex items-center justify-center text-[7.5px] font-bold text-white shadow-xs`}
                      >
                        {replierPost.user.initials}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {isInlined && (
            <span className="text-[10px] font-mono opacity-50 italic">
              (inlined)
            </span>
          )}
        </div>

        {/* Close button if this card is inlined */}
        {isInlined && onCloseInline && (
          <button
            onClick={onCloseInline}
            className="text-[11px] font-mono opacity-60 hover:opacity-100 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full hover:bg-black/10"
            title="Close inlined post"
          >
            <X className="h-3 w-3" />
            <span>[close]</span>
          </button>
        )}
      </div>

      {/* ================= INLINED POSTS CONTAINER ================= */}
      {inlinedPosts.length > 0 && (
        <div className={`my-2 pl-2 sm:pl-3 space-y-2 ${themeStyles.inlineBorder}`}>
          {inlinedPosts.map((targetNum) => {
            const target = postsMap.get(targetNum);
            if (!target) return null;
            return (
              <PostCard
                key={targetNum}
                post={target}
                isInlined={true}
                onCloseInline={() => removeInlinedPost(targetNum)}
                ancestorChain={[...ancestorChain, post.postNumber]}
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

      {/* File details bar */}
      {post.file && (
        <div className={`text-[10.5px] font-mono mb-2 flex flex-wrap items-center gap-1.5 ${themeStyles.fileInfo}`}>
          <span>File:</span>
          <span className="underline cursor-pointer">{post.file.name}</span>
          <span>({post.file.size}, {post.file.dimensions})</span>
        </div>
      )}

      {/* Post Body: Image on left, comment on right */}
      <div className="flex flex-col sm:flex-row items-start gap-3">
        {/* Image Thumbnail with click-to-expand */}
        {post.file && (
          <div className="shrink-0">
            <div
              onClick={() => toggleImageExpand(post.file!.imageNum)}
              className={`relative cursor-pointer overflow-hidden rounded-xl bg-gradient-to-br ${post.file.colorTone} flex flex-col items-center justify-center border border-black/10 select-none shadow-sm transition-all ${
                expandedImages[post.file.imageNum]
                  ? "w-full max-w-[420px] h-[280px]"
                  : `w-[130px] sm:w-[150px] ${post.file.ratioClass}`
              }`}
              title="Click image to expand / minimize"
            >
              <div className="absolute top-1 right-1 rounded-full bg-black/70 p-1 text-white/90">
                {expandedImages[post.file.imageNum] ? (
                  <Minimize2 className="h-2.5 w-2.5" />
                ) : (
                  <Maximize2 className="h-2.5 w-2.5" />
                )}
              </div>
              <span className="text-[9px] font-mono opacity-70 text-zinc-900">
                ATTACHMENT #{post.file.imageNum}
              </span>
              <span className="text-xl font-black font-mono text-zinc-950">
                #{post.file.imageNum}
              </span>
              <span className="text-[8px] opacity-70 font-mono text-zinc-900">
                {post.file.dimensions}
              </span>
            </div>
          </div>
        )}

        {/* Comment text with quotes */}
        {post.comments && post.comments.length > 0 && (
          <div className="flex-1 space-y-1 text-[13.5px] leading-relaxed">
            {post.comments.map((line, lIdx) => {
              const isQuoteLink = line.startsWith(">>");
              const isGreenText = line.startsWith(">");

              if (isQuoteLink) {
                const targetNum = parseInt(line.replace(">>", ""), 10);
                const targetPost = postsMap.get(targetNum);
                const isAlreadyInlined = inlinedPosts.includes(targetNum);

                return (
                  <p key={lIdx} className="font-mono text-xs">
                    <button
                      type="button"
                      onClick={() => toggleInlineQuote(targetNum)}
                      onMouseEnter={(e) => handleQuoteMouseEnter(targetNum, e)}
                      onMouseLeave={handleQuoteMouseLeave}
                      className={`${themeStyles.quoteLink} inline-flex items-center gap-1.5`}
                      title="Left click to inline post above image/text • Hover to preview"
                    >
                      {targetPost && (
                        <span
                          className={`w-3.5 h-3.5 rounded-full bg-gradient-to-br ${targetPost.user.avatarBg} inline-flex items-center justify-center text-[6.5px] font-bold text-white shrink-0`}
                        >
                          {targetPost.user.initials}
                        </span>
                      )}
                      <span>
                        {targetPost ? `@${targetPost.user.username}` : line}
                      </span>
                      <span className="text-[10px] opacity-60">
                        {isAlreadyInlined ? "[inline ✕]" : "[inline ↴]"}
                      </span>
                    </button>
                  </p>
                );
              }

              return (
                <p
                  key={lIdx}
                  className={isGreenText ? `${themeStyles.greenText} font-mono text-[13px]` : ""}
                >
                  {line}
                </p>
              );
            })}
          </div>
        )}
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
  const [showReplyBox, setShowReplyBox] = useState(false);

  // Hover state for floating preview tooltip
  const [hoverState, setHoverState] = useState<HoverState | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load thread data
  const threadData = useMemo(() => getThreadData(threadId), [threadId]);
  const { op, replies } = threadData;

  // Build unified lookup map for any post (OP or reply)
  const postsMap = useMemo(() => {
    const map = new Map<number, UnifiedPost>();

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
        comments: r.comment || [],
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
    setShowReplyBox(true);
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
      inlinedBox: "bg-slate-100/90 border-slate-300 text-slate-800 rounded-md",
      previewBox: "bg-white border-emerald-600 text-slate-800 shadow-xl rounded-md",
      subjectText: "text-indigo-700 font-bold",
      nameText: "text-emerald-700 font-bold",
      postNumber: "text-slate-400 hover:text-slate-700",
      quoteLink: "text-indigo-600 hover:underline cursor-pointer font-medium",
      greenText: "text-emerald-700",
      fileInfo: "text-slate-500",
      metaBar: "border-slate-200 text-slate-400",
      inlineBorder: "border-l-2 border-emerald-600/60",
      tweetButton: "bg-emerald-700 hover:bg-emerald-600 text-white font-medium rounded-md px-4 py-1.5 shadow transition-colors",
    },
  }[theme];

  // Preview target post for floating tooltip
  const previewPost = hoverState ? postsMap.get(hoverState.postNumber) : null;

  return (
    <div className={`min-h-screen ${themeStyles.pageBg} flex flex-col font-sans transition-colors duration-150`}>
      {/* Thread Navigation Header */}
      <header className={`sticky top-0 z-30 border-b backdrop-blur-md px-4 sm:px-6 py-2.5 shadow-sm ${themeStyles.topBar}`}>
        <div className="flex w-full items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className={`flex items-center gap-1.5 font-semibold hover:underline ${
                theme === "twitter" ? "text-[#1DA1F2]" : "text-emerald-700"
              }`}
            >
              {theme === "twitter" ? (
                <TwitterIcon className="h-4 w-4 fill-current" />
              ) : (
                <ArrowLeft className="h-3.5 w-3.5" />
              )}
              <span>[Return to Catalog]</span>
            </Link>
            <span className="opacity-40">/</span>
            <span className="font-mono text-[11px] opacity-75">
              /fit/ - Thread No.{op.threadNumber}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden md:inline font-mono text-[10px] opacity-60">
              Left-click replier avatar to inline • Hover to preview
            </span>

            <a href="#bottom" className="opacity-75 hover:opacity-100 hidden sm:flex items-center gap-1">
              <ArrowDown className="h-3 w-3" />
              <span>[Bottom]</span>
            </a>

            <button
              onClick={() => setShowReplyBox((v) => !v)}
              className={`opacity-85 hover:opacity-100 flex items-center gap-1 font-semibold ${
                theme === "twitter" ? "text-[#1DA1F2]" : "text-emerald-700"
              }`}
            >
              <MessageSquare className="h-3 w-3" />
              <span>[Reply]</span>
            </button>

            {/* Theme Toggle (Twitter -> Classic -> Light) */}
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

      {/* Main Thread Content (LEFT-ALIGNED) */}
      <main className="flex-1 w-full px-4 sm:px-6 py-4 space-y-4">
        {/* ================= ORIGINAL POST (OP) ================= */}
        {postsMap.has(op.threadNumber) && (
          <section id={`p${op.threadNumber}`} className="max-w-3xl">
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
          {replies.map((reply) => {
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
          })}
        </section>

        {/* Quick Reply Form (Left-aligned) */}
        <section className={`p-4 max-w-xl my-8 ${themeStyles.replyBox}`}>
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-current/10 text-xs">
            <span className="font-bold flex items-center gap-1.5">
              <MessageSquare className={`h-3.5 w-3.5 ${theme === "twitter" ? "text-[#1DA1F2]" : "text-emerald-700"}`} />
              Reply to Thread No. {op.threadNumber}
            </span>
            <span className="opacity-50 font-mono text-[10px]">SFW Fitness Board</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Name (e.g. IronLifter)"
                className="w-1/2 rounded-full border border-current/20 bg-transparent px-3 py-1.5 outline-none focus:border-[#1DA1F2] text-xs"
              />
              <input
                type="text"
                placeholder="Options"
                className="w-1/2 rounded-full border border-current/20 bg-transparent px-3 py-1.5 outline-none focus:border-[#1DA1F2] text-xs"
              />
            </div>

            <textarea
              rows={4}
              value={quickReplyText}
              onChange={(e) => setQuickReplyText(e.target.value)}
              placeholder="What's happening? (Quote posts with '>>No.')"
              className="w-full rounded-xl border border-current/20 bg-transparent p-3 font-sans text-xs outline-none focus:border-[#1DA1F2]"
            />

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                className="flex items-center gap-1.5 text-[11px] opacity-70 hover:opacity-100 border border-current/20 rounded-full px-3 py-1"
              >
                <ImageIcon className="h-3.5 w-3.5" />
                <span>Media</span>
              </button>

              <button
                type="button"
                className={themeStyles.tweetButton}
              >
                <div className="flex items-center gap-1.5">
                  <Send className="h-3 w-3" />
                  <span>{theme === "twitter" ? "Tweet Reply" : "Post Reply"}</span>
                </div>
              </button>
            </div>
          </div>
        </section>

        {/* Bottom anchor and controls */}
        <div id="bottom" className={`pt-6 pb-12 flex items-center justify-between text-xs border-t ${themeStyles.metaBar} max-w-5xl`}>
          <Link
            href="/"
            className={`flex items-center gap-1.5 font-semibold hover:underline ${
              theme === "twitter" ? "text-[#1DA1F2]" : "text-emerald-700"
            }`}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>[Return to Catalog]</span>
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
                className={`w-4.5 h-4.5 rounded-full bg-gradient-to-br ${previewPost.user.avatarBg} flex items-center justify-center text-[7.5px] font-bold text-white shadow-xs shrink-0`}
              >
                {previewPost.user.initials}
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
                className={`w-[70px] h-[55px] shrink-0 rounded-lg bg-gradient-to-br ${previewPost.file.colorTone} flex items-center justify-center font-mono text-[10px] font-bold border border-black/10`}
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
