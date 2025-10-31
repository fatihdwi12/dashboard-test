"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Header() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    try {
      setLoading(true);
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <header className="h-14 border-b border-gray-200 flex items-center justify-between px-4 bg-white">
      <div className="font-semibold tracking-tight">
        {process.env.NEXT_PUBLIC_SITE_NAME || "Dashboard"}
      </div>
      <button
        onClick={logout}
        disabled={loading}
        aria-label="Logout"
        className="px-3 py-1.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors">
        {loading ? "Logging out..." : "Logout"}
      </button>
    </header>
  );
}
