// src/app/(app)/layout.tsx
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r hidden md:block">
        <Sidebar />
      </aside>
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-4 container mx-auto max-w-7xl">{children}</main>
      </div>
    </div>
  );
}
