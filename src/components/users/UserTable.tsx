"use client";

import { useMemo, useState, useCallback } from "react";
import type { User } from "@/lib/types";
import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  users: User[] | unknown; // defensif: kadang API mengembalikan { data, meta }
  initialQuery?: string;
  initialPage?: number;
};

type SortKey = "name" | "email" | "username";
type SortDir = "asc" | "desc";

const PAGE_SIZE = 10;

function toStr(v: unknown) {
  return String(v ?? "").toLowerCase();
}

function normalizeUsers(input: unknown): User[] {
  if (Array.isArray(input)) return input as User[];
  if (typeof input === "object" && input !== null) {
    const maybe = (input as Record<string, unknown>).data;
    if (Array.isArray(maybe)) return maybe as User[];
  }
  return [];
}

function sortUsers(data: User[], key: SortKey, dir: SortDir) {
  const m = dir === "asc" ? 1 : -1;
  return [...data].sort((a, b) => {
    const va = toStr(a[key]);
    const vb = toStr(b[key]);
    if (va < vb) return -1 * m;
    if (va > vb) return 1 * m;
    return 0;
  });
}

export default function UserTable({
  users,
  initialQuery = "",
  initialPage = 1,
}: Props) {
  const router = useRouter();
  const sp = useSearchParams();

  // pastikan array users
  const baseUsers = useMemo(() => normalizeUsers(users), [users]);

  const [query, setQuery] = useState(initialQuery);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(initialPage);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return baseUsers;
    return baseUsers.filter((u) =>
      [u.name, u.username, u.email].some((x) => toStr(x).includes(term))
    );
  }, [baseUsers, query]);

  const sorted = useMemo(
    () => sortUsers(filtered, sortKey, sortDir),
    [filtered, sortKey, sortDir]
  );

  const pages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const current = Math.min(Math.max(1, page), pages);
  const start = (current - 1) * PAGE_SIZE;
  const pageData = useMemo(
    () => sorted.slice(start, start + PAGE_SIZE),
    [sorted, start]
  );

  const toggleSort = useCallback(
    (key: SortKey) => {
      if (key === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      else {
        setSortKey(key);
        setSortDir("asc");
      }
    },
    [sortKey]
  );

  const go = useCallback(
    (n: number) => {
      setPage(n);
      const params = new URLSearchParams(sp?.toString());
      params.set("page", String(n));
      params.set("q", query);
      router.replace(`/?${params.toString()}`);
    },
    [router, sp, query]
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <input
          className="border rounded px-3 py-2 w-full"
          placeholder="Search name/username/email..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <div className="overflow-x-auto border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-2">
                <button
                  className="font-medium"
                  onClick={() => toggleSort("name")}>
                  Name{" "}
                  {sortKey === "name" ? (sortDir === "asc" ? "↑" : "↓") : ""}
                </button>
              </th>
              <th className="text-left p-2">
                <button
                  className="font-medium"
                  onClick={() => toggleSort("username")}>
                  Username{" "}
                  {sortKey === "username"
                    ? sortDir === "asc"
                      ? "↑"
                      : "↓"
                    : ""}
                </button>
              </th>
              <th className="text-left p-2">
                <button
                  className="font-medium"
                  onClick={() => toggleSort("email")}>
                  Email{" "}
                  {sortKey === "email" ? (sortDir === "asc" ? "↑" : "↓") : ""}
                </button>
              </th>
              <th className="text-left p-2">Company</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageData.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="p-2">{u.name}</td>
                <td className="p-2">{u.username}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.company?.name || "-"}</td>
                <td className="p-2">
                  <a
                    className="text-indigo-600 hover:underline"
                    href={`/users/${u.id}`}>
                    Detail
                  </a>
                </td>
              </tr>
            ))}
            {pageData.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  No data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Page {current} / {pages} • {sorted.length} items
        </div>
        <div className="flex gap-1">
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            disabled={current <= 1}
            onClick={() => go(current - 1)}>
            Prev
          </button>
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            disabled={current >= pages}
            onClick={() => go(current + 1)}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
