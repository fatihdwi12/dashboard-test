// src/app/login/LoginForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";

export default function LoginForm({ nextRoute = "/dashboard" as Route }) {
  const [username, setU] = useState("");
  const [password, setP] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      router.replace(nextRoute); // <-- pakai nextRoute dari page
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setErr(data?.error || "Login failed");
    }

    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100 p-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm space-y-6 rounded-2xl border border-gray-200 bg-white p-8 shadow-xl transition-all hover:shadow-2xl">
        <h1 className="text-center text-2xl font-semibold text-gray-800">
          Welcome Back 👋
        </h1>
        <p className="text-center text-sm text-gray-500">
          Please sign in to continue
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 focus:outline-none"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setU(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 focus:outline-none"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setP(e.target.value)}
              autoComplete="current-password"
            />
          </div>
        </div>

        {err && (
          <p className="text-center text-sm text-red-600 bg-red-50 py-2 rounded-md border border-red-100">
            {err}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 px-4 py-2 text-white font-medium shadow-md transition-all hover:from-indigo-500 hover:to-indigo-400 focus:ring-4 focus:ring-indigo-300 disabled:opacity-60">
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <p className="text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Dashboard App
        </p>
      </form>
    </div>
  );
}
