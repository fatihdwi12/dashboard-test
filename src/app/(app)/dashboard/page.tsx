// src/app/(app)/dashboard/page.tsx (atau file yang memanggil UserTable)
import UserTable from "@/components/users/UserTable";
import type { User } from "@/lib/types";

export default async function DashboardPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users`, {
    cache: "no-store",
  });
  const payload = await res.json();

  // pastikan array
  const users: User[] = Array.isArray(payload) ? payload : payload?.data ?? [];

  return <UserTable users={users} />;
}
