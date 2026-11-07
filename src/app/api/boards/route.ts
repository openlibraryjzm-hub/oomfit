import { NextResponse } from "next/server";
import { getAllBoards, createBoard } from "@/lib/server/store";

export async function GET() {
  try {
    const boards = await getAllBoards();
    return NextResponse.json({ boards });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch boards" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { shortcode, name, domain, subCategory, description, tags } = body;

    if (!shortcode || !name) {
      return NextResponse.json({ error: "Shortcode and name are required." }, { status: 400 });
    }

    const board = await createBoard({
      shortcode,
      name,
      domain: domain || "Community",
      subCategory: subCategory || "User Created",
      description: description || `Discussions and media for /${shortcode}/`,
      tags: Array.isArray(tags) ? tags : typeof tags === "string" ? tags.split(",").map((s: string) => s.trim()) : [],
    });

    return NextResponse.json({ board }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create board" }, { status: 400 });
  }
}
