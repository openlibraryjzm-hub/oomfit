import { Board } from "./boards";
import { UserProfile } from "./data";
import { Thread, ThreadReply } from "./server/store";

export type { Thread, ThreadReply };

export async function fetchBoards(): Promise<Board[]> {
  try {
    const res = await fetch("/api/boards", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch boards");
    const data = await res.json();
    return data.boards || [];
  } catch (err) {
    console.error("fetchBoards error:", err);
    return [];
  }
}

export async function createCustomBoard(data: {
  shortcode: string;
  name: string;
  domain: string;
  subCategory?: string;
  description: string;
  tags: string[];
}): Promise<Board> {
  const res = await fetch("/api/boards", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || "Failed to create board");
  }
  return json.board;
}

export async function fetchThreads(boardCode?: string): Promise<Thread[]> {
  try {
    const url = boardCode ? `/api/threads?b=${encodeURIComponent(boardCode)}` : "/api/threads";
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch threads");
    const data = await res.json();
    return data.threads || [];
  } catch (err) {
    console.error("fetchThreads error:", err);
    return [];
  }
}

export async function createNewThread(data: {
  boardId: string;
  title: string;
  comment: string;
  user?: Partial<UserProfile>;
  hasImage?: boolean;
}): Promise<Thread> {
  const res = await fetch("/api/threads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || "Failed to create thread");
  }
  return json.thread;
}

export async function fetchThread(id: number): Promise<{ op: Thread; replies: ThreadReply[] } | null> {
  try {
    const res = await fetch(`/api/threads/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("fetchThread error:", err);
    return null;
  }
}

export async function postReply(
  threadId: number,
  data: {
    comment: string;
    replyTo?: number[];
    user?: Partial<UserProfile>;
    hasImage?: boolean;
  }
): Promise<ThreadReply> {
  const res = await fetch(`/api/threads/${threadId}/replies`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || "Failed to post reply");
  }
  return json.reply;
}

export async function triggerBot(
  action: "thread" | "reply",
  params: { boardId?: string; threadId?: number }
): Promise<any> {
  const res = await fetch("/api/bots", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, ...params }),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || "Bot trigger failed");
  }
  return json;
}
