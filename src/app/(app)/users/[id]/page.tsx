import type { User, Post } from "@/types";
import UserDetailClient from "@/components/users/UserDetailClient";
import { notFound, headers } from "next/navigation";

function getBaseUrl() {
  const env = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL;
  if (env) return env.startsWith("http") ? env : `https://${env}`;
  const h = headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  return `${proto}://${host}`;
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const BASE = getBaseUrl();

  const [userRes, postsRes] = await Promise.all([
    // ⬅️ PENTING: pakai API internal supaya override terbaca
    fetch(`${BASE}/api/users/${id}`, { cache: "no-store" }),
    fetch(`https://jsonplaceholder.typicode.com/posts?userId=${id}`, {
      next: { revalidate: 60 },
    }),
  ]);

  if (!userRes.ok) notFound();

  const user: User = await userRes.json();
  const posts: Post[] = postsRes.ok ? await postsRes.json() : [];

  return <UserDetailClient initialUser={user} posts={posts} />;
}
