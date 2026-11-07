import { supabase } from "../supabase";
import { allBoards, Board } from "../boards";
import { UserProfile, aspectRatios } from "../data";

export interface Thread {
  id: number;
  threadNumber: number;
  boardId: string;
  title: string;
  teaser: string;
  replies: number;
  images: number;
  timestamp: string;
  createdAt: string;
  user: UserProfile;
  colorTone: string;
  aspect: {
    ratioClass: string;
    dimLabel: string;
  };
  comments: string[];
  file?: {
    name: string;
    size: string;
    dimensions: string;
    ratioClass: string;
    colorTone: string;
    imageNum: number;
    url?: string;
  };
}

export interface ThreadReply {
  id: number;
  postNumber: number;
  threadId: number;
  user: UserProfile;
  timestamp: string;
  createdAt: string;
  replyTo: number[];
  comments: string[];
  file?: {
    name: string;
    size: string;
    dimensions: string;
    ratioClass: string;
    colorTone: string;
    imageNum: number;
    url?: string;
  };
}

// ----------------------------------------------------
// BOARDS (Supabase + Built-in Static Boards)
// ----------------------------------------------------
export async function getCustomBoards(): Promise<Board[]> {
  try {
    const { data, error } = await supabase
      .from("boards")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Supabase boards query warning:", error.message);
      return [];
    }

    return (data || []).map((row: any) => ({
      id: row.id,
      shortcode: row.shortcode,
      name: row.name,
      domain: row.domain || "Community",
      subCategory: row.sub_category || "User Created",
      description: row.description || "",
      tags: row.tags || [],
    }));
  } catch (err) {
    console.error("Failed to query boards from Supabase:", err);
    return [];
  }
}

export async function getAllBoards(): Promise<Board[]> {
  const custom = await getCustomBoards();
  const customCodes = new Set(custom.map((b) => b.shortcode.toLowerCase()));
  const filteredStatic = allBoards.filter((b) => !customCodes.has(b.shortcode.toLowerCase()));
  return [...custom, ...filteredStatic];
}

export async function getBoardByCode(codeOrId: string): Promise<Board | null> {
  const clean = codeOrId.toLowerCase().replace(/^\/+|\/+$/g, "").trim();
  const boards = await getAllBoards();
  return (
    boards.find(
      (b) =>
        b.shortcode.toLowerCase() === clean ||
        b.id.toLowerCase() === clean ||
        b.name.toLowerCase() === clean
    ) || null
  );
}

// Ensures board exists in Supabase so foreign key references on threads succeed
async function ensureBoardInSupabase(boardCode: string): Promise<void> {
  const cleanCode = boardCode.toLowerCase().replace(/[^a-z0-9_-]/g, "").trim();
  const board = await getBoardByCode(cleanCode);

  const name = board?.name || cleanCode.toUpperCase();
  const domain = board?.domain || "Community";
  const subCategory = board?.subCategory || "General";
  const description = board?.description || `Board /${cleanCode}/`;
  const tags = board?.tags || [cleanCode];

  await supabase.from("boards").upsert(
    {
      id: cleanCode,
      shortcode: cleanCode,
      name,
      domain,
      sub_category: subCategory,
      description,
      tags,
    },
    { onConflict: "shortcode" }
  );
}

export async function createBoard(data: {
  shortcode: string;
  name: string;
  domain: string;
  subCategory?: string;
  description: string;
  tags: string[];
}): Promise<Board> {
  const cleanCode = data.shortcode.toLowerCase().replace(/[^a-z0-9_-]/g, "").trim();

  const newBoard: Board = {
    id: cleanCode,
    shortcode: cleanCode,
    name: data.name.trim(),
    domain: data.domain.trim() || "Community",
    subCategory: data.subCategory?.trim() || "User Created",
    description: data.description.trim(),
    tags: Array.from(new Set(data.tags.map((t) => t.toLowerCase().trim()).filter(Boolean))),
  };

  const { error } = await supabase.from("boards").insert({
    id: newBoard.id,
    shortcode: newBoard.shortcode,
    name: newBoard.name,
    domain: newBoard.domain,
    sub_category: newBoard.subCategory,
    description: newBoard.description,
    tags: newBoard.tags,
  });

  if (error) {
    throw new Error(error.message);
  }

  return newBoard;
}

// ----------------------------------------------------
// THREADS (Supabase)
// ----------------------------------------------------
export async function getThreads(boardShortcode?: string): Promise<Thread[]> {
  try {
    let query = supabase.from("threads").select("*");
    if (boardShortcode) {
      const cleanCode = boardShortcode.toLowerCase().replace(/^\/+|\/+$/g, "").trim();
      query = query.eq("board_id", cleanCode);
    }

    const { data, error } = await query.order("id", { ascending: false });

    if (error) {
      console.warn("Supabase threads query warning:", error.message);
      return [];
    }

    return (data || []).map((row: any) => ({
      id: Number(row.id),
      threadNumber: Number(row.thread_number),
      boardId: row.board_id,
      title: row.title || "",
      teaser: row.teaser || "",
      replies: Number(row.replies) || 0,
      images: Number(row.images) || 0,
      timestamp: row.timestamp_label || "",
      createdAt: row.created_at,
      user: {
        id: row.author_id,
        username: row.author_name,
        avatarBg: row.author_avatar_bg,
        avatarText: "text-white",
        initials: row.author_initials,
      },
      colorTone: row.color_tone || "from-slate-700 to-zinc-900",
      aspect: row.aspect_ratio || {
        ratioClass: "aspect-[16/9] w-full max-h-[140px]",
        dimLabel: "1920x1080 (16:9)",
      },
      comments: row.comments || [],
      file: row.file_metadata || undefined,
    }));
  } catch (err) {
    console.error("Failed to query threads:", err);
    return [];
  }
}

export async function getThreadById(
  threadId: number
): Promise<{ op: Thread; replies: ThreadReply[] } | null> {
  try {
    const { data: opRow, error: opErr } = await supabase
      .from("threads")
      .select("*")
      .eq("id", threadId)
      .single();

    if (opErr || !opRow) {
      return null;
    }

    const { data: replyRows } = await supabase
      .from("replies")
      .select("*")
      .eq("thread_id", threadId)
      .order("id", { ascending: true });

    const op: Thread = {
      id: Number(opRow.id),
      threadNumber: Number(opRow.thread_number),
      boardId: opRow.board_id,
      title: opRow.title || "",
      teaser: opRow.teaser || "",
      replies: Number(opRow.replies) || 0,
      images: Number(opRow.images) || 0,
      timestamp: opRow.timestamp_label || "",
      createdAt: opRow.created_at,
      user: {
        id: opRow.author_id,
        username: opRow.author_name,
        avatarBg: opRow.author_avatar_bg,
        avatarText: "text-white",
        initials: opRow.author_initials,
      },
      colorTone: opRow.color_tone || "from-slate-700 to-zinc-900",
      aspect: opRow.aspect_ratio || {
        ratioClass: "aspect-[16/9] w-full max-h-[140px]",
        dimLabel: "1920x1080 (16:9)",
      },
      comments: opRow.comments || [],
      file: opRow.file_metadata || undefined,
    };

    const replies: ThreadReply[] = (replyRows || []).map((row: any) => ({
      id: Number(row.id),
      postNumber: Number(row.post_number),
      threadId: Number(row.thread_id),
      user: {
        id: row.author_id,
        username: row.author_name,
        avatarBg: row.author_avatar_bg,
        avatarText: "text-white",
        initials: row.author_initials,
      },
      timestamp: row.timestamp_label,
      createdAt: row.created_at,
      replyTo: (row.reply_to || []).map(Number),
      comments: row.comments || [],
      file: row.file_metadata || undefined,
    }));

    return { op, replies };
  } catch (err) {
    console.error("Failed to query thread by id:", err);
    return null;
  }
}

export async function createThread(data: {
  boardId: string;
  title: string;
  comment: string;
  user?: Partial<UserProfile>;
  hasImage?: boolean;
}): Promise<Thread> {
  const cleanBoard = data.boardId.toLowerCase().replace(/^\/+|\/+$/g, "").trim();

  // Make sure board exists in Supabase
  await ensureBoardInSupabase(cleanBoard);

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "2-digit" });
  const timeStr = now.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" });
  const dayStr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][now.getDay()];
  const timestamp = `${dateStr}(${dayStr})${timeStr}`;

  // Unique post number based on timestamp sequence
  const threadNumber = 1000000 + Math.floor(Date.now() % 10000000);

  const authorName = data.user?.username?.trim() || "Anonymous";
  const authorInitials =
    data.user?.initials || (authorName.length >= 2 ? authorName.slice(0, 2).toUpperCase() : "AN");
  const authorAvatarBg = data.user?.avatarBg || "from-emerald-600 to-teal-800";

  const aspect = aspectRatios[Math.floor(Math.random() * aspectRatios.length)];
  const colorTones = [
    "from-slate-700 to-zinc-900",
    "from-emerald-700 to-teal-900",
    "from-blue-700 to-cyan-900",
    "from-violet-700 to-purple-900",
    "from-amber-700 to-orange-900",
    "from-rose-700 to-pink-900",
  ];
  const colorTone = colorTones[Math.floor(Math.random() * colorTones.length)];

  const comments = data.comment
    ? data.comment.split("\n").map((l) => l.trim()).filter((l) => l.length > 0)
    : ["No comment text provided."];

  const teaser = comments.slice(0, 3).join(" ");
  const hasImage = data.hasImage !== false;

  const fileMetadata = hasImage
    ? {
        name: `upload_${threadNumber}.png`,
        size: `${Math.floor(Math.random() * 800 + 120)} KB`,
        dimensions: aspect.dimLabel.split(" ")[0] || "1920x1080",
        ratioClass: aspect.ratioClass,
        colorTone,
        imageNum: threadNumber,
      }
    : null;

  const { data: inserted, error } = await supabase
    .from("threads")
    .insert({
      thread_number: threadNumber,
      board_id: cleanBoard,
      title: data.title.trim() || `Untitled Thread #${threadNumber}`,
      teaser,
      replies: 0,
      images: hasImage ? 1 : 0,
      author_id: data.user?.id || `u_${Date.now()}`,
      author_name: authorName,
      author_avatar_bg: authorAvatarBg,
      author_initials: authorInitials,
      timestamp_label: timestamp,
      color_tone: colorTone,
      aspect_ratio: aspect,
      comments,
      file_metadata: fileMetadata,
    })
    .select()
    .single();

  if (error || !inserted) {
    throw new Error(error?.message || "Failed to insert thread to Supabase");
  }

  return {
    id: Number(inserted.id),
    threadNumber: Number(inserted.thread_number),
    boardId: inserted.board_id,
    title: inserted.title,
    teaser: inserted.teaser,
    replies: Number(inserted.replies),
    images: Number(inserted.images),
    timestamp: inserted.timestamp_label,
    createdAt: inserted.created_at,
    user: {
      id: inserted.author_id,
      username: inserted.author_name,
      avatarBg: inserted.author_avatar_bg,
      avatarText: "text-white",
      initials: inserted.author_initials,
    },
    colorTone: inserted.color_tone,
    aspect: inserted.aspect_ratio,
    comments: inserted.comments,
    file: inserted.file_metadata || undefined,
  };
}

export async function createReply(data: {
  threadId: number;
  comment: string;
  replyTo?: number[];
  user?: Partial<UserProfile>;
  hasImage?: boolean;
}): Promise<ThreadReply> {
  const { data: threadRow, error: findErr } = await supabase
    .from("threads")
    .select("*")
    .eq("id", data.threadId)
    .single();

  if (findErr || !threadRow) {
    throw new Error(`Thread #${data.threadId} not found in Supabase.`);
  }

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "2-digit" });
  const timeStr = now.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" });
  const dayStr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][now.getDay()];
  const timestamp = `${dateStr}(${dayStr})${timeStr}`;

  const postNumber = 1000000 + Math.floor(Date.now() % 10000000);
  const authorName = data.user?.username?.trim() || "Anonymous";
  const authorInitials =
    data.user?.initials || (authorName.length >= 2 ? authorName.slice(0, 2).toUpperCase() : "AN");
  const authorAvatarBg = data.user?.avatarBg || "from-blue-600 to-indigo-800";

  const hasImage = Boolean(data.hasImage);
  const aspect = aspectRatios[Math.floor(Math.random() * aspectRatios.length)];
  const colorTone = "from-cyan-700 to-blue-900";

  const comments = data.comment
    ? data.comment.split("\n").map((l) => l.trim()).filter((l) => l.length > 0)
    : [];

  const fileMetadata = hasImage
    ? {
        name: `reply_${postNumber}.png`,
        size: `${Math.floor(Math.random() * 500 + 80)} KB`,
        dimensions: aspect.dimLabel.split(" ")[0] || "1200x800",
        ratioClass: aspect.ratioClass,
        colorTone,
        imageNum: postNumber,
      }
    : null;

  const { data: inserted, error: insertErr } = await supabase
    .from("replies")
    .insert({
      post_number: postNumber,
      thread_id: data.threadId,
      author_id: data.user?.id || `u_${Date.now()}`,
      author_name: authorName,
      author_avatar_bg: authorAvatarBg,
      author_initials: authorInitials,
      timestamp_label: timestamp,
      reply_to: data.replyTo || [],
      comments,
      file_metadata: fileMetadata,
    })
    .select()
    .single();

  if (insertErr || !inserted) {
    throw new Error(insertErr?.message || "Failed to insert reply to Supabase");
  }

  // Increment replies counter on thread
  await supabase
    .from("threads")
    .update({
      replies: Number(threadRow.replies || 0) + 1,
      images: hasImage ? Number(threadRow.images || 0) + 1 : Number(threadRow.images || 0),
    })
    .eq("id", data.threadId);

  return {
    id: Number(inserted.id),
    postNumber: Number(inserted.post_number),
    threadId: Number(inserted.thread_id),
    user: {
      id: inserted.author_id,
      username: inserted.author_name,
      avatarBg: inserted.author_avatar_bg,
      avatarText: "text-white",
      initials: inserted.author_initials,
    },
    timestamp: inserted.timestamp_label,
    createdAt: inserted.created_at,
    replyTo: (inserted.reply_to || []).map(Number),
    comments: inserted.comments,
    file: inserted.file_metadata || undefined,
  };
}
