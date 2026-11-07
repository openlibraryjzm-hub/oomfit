import { NextResponse } from "next/server";
import { createBotThread, createBotReply } from "@/lib/server/bots";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, boardId, threadId } = body;

    if (action === "thread") {
      if (!boardId) {
        return NextResponse.json({ error: "boardId is required to create a bot thread." }, { status: 400 });
      }
      const thread = await createBotThread(boardId);
      return NextResponse.json({ thread, message: `Bot created thread on /${boardId}/` }, { status: 201 });
    } else if (action === "reply") {
      if (!threadId) {
        return NextResponse.json({ error: "threadId is required to create a bot reply." }, { status: 400 });
      }
      const reply = await createBotReply(threadId);
      return NextResponse.json({ reply, message: `Bot replied to thread #${threadId}` }, { status: 201 });
    }

    return NextResponse.json({ error: "Invalid action. Use 'thread' or 'reply'." }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Bot action failed" }, { status: 500 });
  }
}
