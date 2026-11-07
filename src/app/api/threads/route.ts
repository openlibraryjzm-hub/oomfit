import { NextResponse } from "next/server";
import { getThreads, createThread } from "@/lib/server/store";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const board = searchParams.get("b") || searchParams.get("board") || undefined;
    const threads = await getThreads(board);
    return NextResponse.json({ threads });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch threads" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { boardId, title, comment, user, hasImage } = body;

    if (!boardId || !comment) {
      return NextResponse.json({ error: "boardId and comment are required." }, { status: 400 });
    }

    const thread = await createThread({
      boardId,
      title: title || "",
      comment,
      user,
      hasImage,
    });

    return NextResponse.json({ thread }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create thread" }, { status: 400 });
  }
}
