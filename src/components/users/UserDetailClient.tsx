// src/components/users/UserDetailClient.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { User, Post } from "@/types";
import EditUserForm from "./EditUserForm";

export default function UserDetailClient({
  initialUser,
  posts,
}: {
  initialUser: User;
  posts: Post[];
}) {
  const [user, setUser] = useState<User>(initialUser);
  const router = useRouter();

  // Prefetch dashboard biar navigasi balik cepat
  useEffect(() => {
    router.prefetch("/dashboard");
  }, [router]);

  // Dipakai ketika form sukses update
  function handleUpdated(next: User) {
    setUser(next); // update state detail
    router.refresh(); // **kunci**: invalidasi data RSC di client
    // (opsional) kalau kamu mau langsung balik otomatis:
    // router.replace("/dashboard");
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border p-4">
        <h1 className="text-xl font-semibold">{user.name}</h1>
        <p className="text-sm text-gray-500">@{user.username}</p>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div>Email: {user.email}</div>
          <div>Phone: {user.phone}</div>
          <div>Website: {user.website}</div>
          <div>Company: {user.company?.name}</div>
          <div>
            Address: {user.address?.street}, {user.address?.city}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">Edit User</h2>
          <button
            onClick={() => {
              router.refresh(); // pastikan state server segar
              router.push("/dashboard");
            }}
            className="text-sm underline">
            ← Back to Dashboard
          </button>
        </div>
        <EditUserForm user={user} onUpdated={handleUpdated} />
      </div>

      <div className="rounded-2xl border p-4">
        <h2 className="text-lg font-semibold mb-2">Posts</h2>
        <ul className="space-y-2">
          {posts.map((p) => (
            <li key={p.id} className="border rounded p-3">
              <div className="font-medium">{p.title}</div>
              <div className="text-sm text-gray-600 whitespace-pre-line">
                {p.body}
              </div>
            </li>
          ))}
          {!posts.length && (
            <li className="text-sm text-gray-500">No posts.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
