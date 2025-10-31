import type { User } from "@/types";

declare global {
  var __USER_OVERRIDES__: Map<number, Partial<User>> | undefined;
}

if (!globalThis.__USER_OVERRIDES__) {
  globalThis.__USER_OVERRIDES__ = new Map<number, Partial<User>>();
}
const OV = globalThis.__USER_OVERRIDES__!;

// ---- API fungsi store ----
export function getAllUserOverrides(): Map<number, Partial<User>> {
  return OV;
}

export function getUserOverride(id: number): Partial<User> | undefined {
  return OV.get(id);
}

export function patchUserOverride(
  id: number,
  patch: Partial<User>
): Partial<User> {
  const prev = (OV.get(id) ?? {}) as Partial<User>;
  const next = deepMerge(prev, patch);
  OV.set(id, next);
  return next;
}

export function deleteUserOverride(id: number): boolean {
  return OV.delete(id);
}

// ---- Util: deep merge yang type-safe ----
function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function deepMerge<T extends Record<string, unknown>>(a: T, b: Partial<T>): T {
  const out: Record<string, unknown> = { ...a };

  for (const [k, v] of Object.entries(b)) {
    const key = k as keyof T;
    const av = out[key as string];

    if (isPlainObject(av) && isPlainObject(v)) {
      out[key as string] = deepMerge(
        av as Record<string, unknown>,
        v as Partial<Record<string, unknown>>
      );
    } else if (v !== undefined) {
      out[key as string] = v as unknown;
    }
    // jika v === undefined, biarkan nilai lama tetap ada (tidak menghapus field)
  }

  return out as T;
}
