import { NextResponse } from "next/server";
import { createReply } from "@/lib/server/store";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const threadId = parseInt(id, 10);
    if (isNaN(threadId)) {
      return NextResponse.json({ error: "Invalid thread ID" }, { status: 400 });
    }

    const body = await request.json();
    const { comment, replyTo, user, hasImage } = body;

    if (!comment) {
      return NextResponse.json({ error: "Comment is required." }, { status: 400 });
    }

    const reply = await createReply({
      threadId,
      comment,
      replyTo,
      user,
      hasImage,
    });

    return NextResponse.json({ reply }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to post reply" }, { status: 400 });
  }
}
