// src/lib/db.ts
import fs from "node:fs";
import path from "node:path";

export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  phone?: string;
  website?: string;
  company?: { name?: string };
  address?: { street?: string; city?: string };
};

type DBShape = { users: User[] };

declare global {
  var __DB__: DBShape | undefined;
}

function loadSeed(): User[] {
  try {
    const p = path.join(process.cwd(), "data", "users.seed.json");
    if (fs.existsSync(p)) {
      const raw = fs.readFileSync(p, "utf-8");
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) return arr as User[];
    }
  } catch {
    // ignore
  }
  // fallback seed minimal
  return [
    {
      id: 1,
      name: "Alice",
      username: "alice",
      email: "alice@example.com",
      company: { name: "Acme" },
    },
    {
      id: 2,
      name: "Bob",
      username: "bob",
      email: "bob@example.com",
      company: { name: "Beta" },
    },
    {
      id: 5,
      name: "Budi",
      username: "budi",
      email: "budi@example.com",
      company: { name: "Contoso" },
    },
  ];
}

function ensureDB(): DBShape {
  if (!globalThis.__DB__) {
    globalThis.__DB__ = { users: loadSeed() };
  }
  return globalThis.__DB__!;
}

type ListUsersResult = {
  data: User[];
  meta: { total: number; page: number; limit: number; pages: number };
};

export function listUsers(q = "", page = 1, limit = 10): ListUsersResult {
  const { users } = ensureDB();
  const term = q.trim().toLowerCase();

  const filtered = term
    ? users.filter((u) =>
        [u.name, u.username, u.email]
          .map((x) => x.toLowerCase())
          .some((s) => s.includes(term))
      )
    : users;

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / Math.max(1, limit)));
  const current = Math.min(Math.max(1, page), pages);
  const start = (current - 1) * limit;
  const data = filtered.slice(start, start + limit);

  return {
    data,
    meta: { total, page: current, limit, pages },
  };
}

export function findUser(id: number): User | undefined {
  const { users } = ensureDB();
  return users.find((u) => u.id === id);
}

export function updateUser(
  id: number,
  patch: Partial<Omit<User, "id">>
): User | null {
  const { users } = ensureDB();
  const i = users.findIndex((u) => u.id === id);
  if (i === -1) return null;

  // Pastikan element pasti ada (sudah dicek i !== -1)
  const current = users[i]!;

  // Mulai dari objek User yang valid
  const next: User = { ...current, id };

  if (patch.name !== undefined) next.name = patch.name;
  if (patch.username !== undefined) next.username = patch.username;
  if (patch.email !== undefined) next.email = patch.email;
  if (patch.phone !== undefined) next.phone = patch.phone;
  if (patch.website !== undefined) next.website = patch.website;
  if (patch.company !== undefined) next.company = patch.company;
  if (patch.address !== undefined) next.address = patch.address;

  users[i] = next;
  return next;
}

export function deleteUser(id: number): boolean {
  const { users } = ensureDB();
  const i = users.findIndex((u) => u.id === id);
  if (i === -1) return false;
  users.splice(i, 1);
  return true;
}
