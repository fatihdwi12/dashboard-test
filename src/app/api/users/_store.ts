// src/app/api/users/_store.ts
import type { User, Address, Company } from "@/types";

const g = globalThis as unknown as {
  __USER_OVERRIDES__?: Map<number, Partial<User>>;
};
if (!g.__USER_OVERRIDES__)
  g.__USER_OVERRIDES__ = new Map<number, Partial<User>>();
const OV: Map<number, Partial<User>> = g.__USER_OVERRIDES__!;

export function getAllUserOverrides(): Map<number, Partial<User>> {
  return OV;
}
export function getUserOverride(id: number): Partial<User> | undefined {
  return OV.get(id);
}

function mergeAddress(a?: Address, b?: Address): Address | undefined {
  if (!a && !b) return undefined;
  return { ...(a ?? {}), ...(b ?? {}) } as Address;
}

function mergeCompany(a?: Company, b?: Company): Company | undefined {
  if (!a && !b) return undefined;
  return { ...(a ?? {}), ...(b ?? {}) } as Company;
}

function mergeUser(a: Partial<User>, b: Partial<User>): Partial<User> {
  const address = mergeAddress(a.address, b.address);
  const company = mergeCompany(a.company, b.company);

  // Penting: hanya sertakan key jika nilainya defined (bukan undefined)
  const next: Partial<User> = {
    ...a,
    ...b,
    ...(address !== undefined ? { address } : {}),
    ...(company !== undefined ? { company } : {}),
  };
  return next;
}

export function patchUserOverride(
  id: number,
  patch: Partial<User>
): Partial<User> {
  const prev = OV.get(id) ?? {};
  const next = mergeUser(prev, patch);
  OV.set(id, next);
  return next;
}

export function deleteUserOverride(id: number): boolean {
  return OV.delete(id);
}
