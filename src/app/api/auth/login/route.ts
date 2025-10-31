// src/app/api/auth/login/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AUTH, COOKIE_NAME, signToken } from "@/lib/auth";
import { z } from "zod";

const LoginSchema = z.object({
  username: z.string().min(1, "Username required"),
  password: z.string().min(1, "Password required"),
});

function norm(v: unknown) {
  return (v ?? "").toString().normalize("NFKC").trim();
}

export async function POST(req: Request) {
  try {
    const ct = (req.headers.get("content-type") || "").toLowerCase();

    let rawUsername: unknown = "";
    let rawPassword: unknown = "";

    if (ct.includes("application/json")) {
      const body: unknown = await req.json().catch(() => ({}));
      if (typeof body === "object" && body !== null) {
        rawUsername = (body as Record<string, unknown>).username;
        rawPassword = (body as Record<string, unknown>).password;
      }
    } else if (
      ct.includes("application/x-www-form-urlencoded") ||
      ct.includes("multipart/form-data")
    ) {
      const form = await req.formData();
      rawUsername = form.get("username");
      rawPassword = form.get("password");
    } else {
      const body: unknown = await req.json().catch(() => ({}));
      if (typeof body === "object" && body !== null) {
        rawUsername = (body as Record<string, unknown>).username;
        rawPassword = (body as Record<string, unknown>).password;
      }
    }

    const parsed = LoginSchema.safeParse({
      username: norm(rawUsername),
      password: norm(rawPassword),
    });
    if (!parsed.success) {
      const msg = parsed.error.errors.map((e) => e.message).join(", ");
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    const { username, password } = parsed.data;

    if (username !== AUTH.user || password !== AUTH.pass) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = await signToken({ sub: username });
    const jar = await cookies();
    jar.set(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: Number(process.env.COOKIE_MAX_AGE || 60 * 60 * 24 * 7),
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
