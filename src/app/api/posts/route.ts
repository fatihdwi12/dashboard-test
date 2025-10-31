import { NextResponse } from "next/server";
import type { Post } from "@/types";

const UP = "https://jsonplaceholder.typicode.com" as const;

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId") ?? undefined;
    const tag = userId ? `posts:user:${userId}` : "posts";

    const r = await fetch(`${UP}/posts${userId ? `?userId=${userId}` : ""}`, {
      next: { revalidate: 60, tags: [tag] },
    });
    if (!r.ok)
      return NextResponse.json({ error: "Upstream error" }, { status: 502 });

    const data = (await r.json()) as Post[];
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
