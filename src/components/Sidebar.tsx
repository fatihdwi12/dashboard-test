"use client";
import Link from "next/link";
import { useState } from "react";

export function Sidebar() {
  const [open, setOpen] = useState(true);
  return (
    <aside
      className={`border-r dark:border-gray-800 ${
        open ? "w-64" : "w-14"
      } transition-all duration-200 hidden md:block`}>
      <div className="h-14 flex items-center justify-between px-3">
        <span className="font-medium">Menu</span>
      </div>
      <nav className="px-3 space-y-1">
        <Link
          className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-900"
          href="/dashboard">
          Dashboard
        </Link>
      </nav>
    </aside>
  );
}
