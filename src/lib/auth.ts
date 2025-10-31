// src/lib/auth.ts
import { SignJWT, jwtVerify, type JWTPayload } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret");

// Nama cookie bisa diubah via ENV, default "token"
export const COOKIE_NAME = (process.env.COOKIE_NAME || "token").trim();

// Default 7 hari jika tidak diset
const DEFAULT_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

/**
 * Menandatangani JWT dengan HS256.
 * @param payload - data payload (mis. { sub: username })
 * @param maxAgeSec - umur token (detik)
 */
export async function signToken(
  payload: JWTPayload | Record<string, unknown>,
  maxAgeSec = Number(process.env.COOKIE_MAX_AGE || DEFAULT_COOKIE_MAX_AGE)
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt(now)
    .setExpirationTime(now + maxAgeSec)
    .sign(secret);
}

/**
 * Memverifikasi JWT dan mengembalikan payload bertipe.
 * Gunakan: const p = await verifyToken<{ sub: string }>(token)
 */
export async function verifyToken<T extends JWTPayload = JWTPayload>(
  token: string
): Promise<T> {
  const { payload } = await jwtVerify(token, secret);
  return payload as T;
}

export const AUTH = {
  user: (process.env.AUTH_USERNAME || "testuser").trim(),
  pass: (process.env.AUTH_PASSWORD || "testpass").trim(),
} as const;
