"use client";

import { useTheme } from "next-themes";

// Hilangkan useEffect & state mounted; gunakan guard isClient
export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const isClient = typeof window !== "undefined";
  if (!isClient) return null; // cegah mismatch hydration

  const current = theme === "system" ? resolvedTheme : theme;

  return (
    <button
      className="border rounded px-3 py-1"
      onClick={() => setTheme(current === "dark" ? "light" : "dark")}
      aria-label="Toggle theme">
      {current === "dark" ? "🌙" : "☀️"}
    </button>
  );
}
