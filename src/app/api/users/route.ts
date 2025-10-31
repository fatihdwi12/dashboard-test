// src/app/api/users/route.ts
import { NextResponse } from "next/server";
import type { User } from "@/types";
import { getAllUserOverrides } from "./_store";

const UP = "https://jsonplaceholder.typicode.com" as const;

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}
function s(v: unknown) {
  return (v ?? "").toString();
}
function includesI(hay: unknown, needle: string) {
  return s(hay).toLowerCase().includes(needle);
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const q = s(url.searchParams.get("q")).trim().toLowerCase();

    const pageRaw = Number(url.searchParams.get("_page") ?? "1");
    const limitRaw = Number(url.searchParams.get("_limit") ?? "10");
    const page = clamp(Number.isFinite(pageRaw) ? pageRaw : 1, 1, 10_000);
    const limit = clamp(Number.isFinite(limitRaw) ? limitRaw : 10, 1, 100);

    const r = await fetch(`${UP}/users`, {
      next: { revalidate: 60, tags: ["users"] },
    });
    if (!r.ok)
      return NextResponse.json({ error: "Upstream error" }, { status: 502 });

    const overrides = getAllUserOverrides();
    const baseUsers = (await r.json()) as User[];
    let users: User[] = baseUsers.map((u) => {
      const ov = overrides.get(u.id);
      if (!ov) return u;
      return {
        ...u,
        ...ov,
        address: { ...u.address, ...(ov.address ?? {}) },
        company: { ...u.company, ...(ov.company ?? {}) },
      };
    });

    if (q) {
      users = users.filter(
        (u) =>
          includesI(u.name, q) ||
          includesI(u.username, q) ||
          includesI(u.email, q)
      );
    }

    const total = users.length;
    const pages = Math.max(1, Math.ceil(total / limit));
    const safePage = clamp(page, 1, pages);
    const start = (safePage - 1) * limit;
    const data = users.slice(start, start + limit);

    return NextResponse.json({
      data,
      meta: { total, page: safePage, limit, pages },
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
