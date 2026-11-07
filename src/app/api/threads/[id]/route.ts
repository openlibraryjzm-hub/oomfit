import { NextResponse } from "next/server";
import { getThreadById } from "@/lib/server/store";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const threadId = parseInt(id, 10);
    if (isNaN(threadId)) {
      return NextResponse.json({ error: "Invalid thread ID" }, { status: 400 });
    }

    const threadData = await getThreadById(threadId);
    if (!threadData) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }

    return NextResponse.json(threadData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch thread" }, { status: 500 });
  }
}
