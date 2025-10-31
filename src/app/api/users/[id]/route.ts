// src/app/api/users/[id]/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import type { User } from "@/types";
import {
  getUserOverride,
  patchUserOverride,
  deleteUserOverride,
} from "../_store";
import { userPatchSchema } from "@/schemas/user";

const UP = "https://jsonplaceholder.typicode.com" as const;
const COOKIE_NAME = process.env.COOKIE_NAME || "token";
export const revalidate = 60;

type RouteCtx = { params: Promise<{ id: string }> };

function bad(msg: string, code = 400) {
  return NextResponse.json({ error: msg }, { status: code });
}
function toId(idStr: string) {
  const n = Number(idStr);
  return Number.isInteger(n) && n > 0 ? n : null;
}

// Hapus nilai undefined (deep) agar kompatibel dengan exactOptionalPropertyTypes
function stripUndefinedDeep<T>(input: T): T {
  if (Array.isArray(input)) {
    return input.map((v) => stripUndefinedDeep(v)) as unknown as T;
  }
  if (input && typeof input === "object") {
    const src = input as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(src)) {
      if (v === undefined) continue;
      out[k] = stripUndefinedDeep(v as unknown);
    }
    return out as T;
  }
  return input;
}

// GET /api/users/:id -> upstream + override (merge nested address/company)
export async function GET(_req: Request, ctx: RouteCtx) {
  const { id: idStr } = await ctx.params;
  const id = toId(idStr);
  if (!id) return bad("Invalid id");

  const r = await fetch(`${UP}/users/${id}`, {
    next: { revalidate, tags: ["users"] },
  });
  if (!r.ok) return bad("User not found", 404);

  const base = (await r.json()) as User;
  const ov = getUserOverride(id);
  const user: User = {
    ...base,
    ...(ov || {}),
    address: { ...base.address, ...(ov?.address ?? {}) },
    company: { ...base.company, ...(ov?.company ?? {}) },
  };
  return NextResponse.json(user);
}

// PUT /api/users/:id -> simpan override (in-memory), validasi Zod, merge & return
export async function PUT(req: Request, ctx: RouteCtx) {
  const { id: idStr } = await ctx.params;
  const id = toId(idStr);
  if (!id) return bad("Invalid id");

  // ⬇️ Tambahkan await di sini
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return bad("Unauthorized", 401);

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return bad("Body must be valid JSON");
  }

  const parsed = userPatchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const cleanPatch = stripUndefinedDeep(parsed.data) as Partial<User>;

  // Pastikan user ada di upstream (untuk 404)
  const upstream = await fetch(`${UP}/users/${id}`, {
    next: { revalidate, tags: ["users"] },
  });
  if (!upstream.ok) return bad("User not found", 404);

  // Simpan override ke store
  const saved = patchUserOverride(id, cleanPatch);

  // Kembalikan hasil merge terbaru (upstream + override)
  const base = (await upstream.json()) as User;
  const merged: User = {
    ...base,
    ...saved,
    address: { ...base.address, ...(saved.address ?? {}) },
    company: { ...base.company, ...(saved.company ?? {}) },
  };
  return NextResponse.json(merged, { status: 200 });
}

// PATCH /api/users/:id -> delagasikan ke PUT agar form PATCH bekerja
export async function PATCH(req: Request, ctx: RouteCtx) {
  return PUT(req, ctx);
}

// DELETE /api/users/:id -> hapus override
export async function DELETE(_req: Request, ctx: RouteCtx) {
  const { id: idStr } = await ctx.params;
  const id = toId(idStr);
  if (!id) return bad("Invalid id");

  // ⬇️ Tambahkan await di sini juga
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return bad("Unauthorized", 401);

  deleteUserOverride(id);
  revalidateTag("users");
  return NextResponse.json({ ok: true, id });
}
