"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import type { Route } from "next";
import LoginForm from "./LoginForm";

// Bungkus dengan Suspense agar useSearchParams aman
export default function Page() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}

function LoginInner() {
  const sp = useSearchParams();
  const nextParam = sp.get("next") ?? "/dashboard";
  const nextRoute = (
    nextParam.startsWith("/") ? nextParam : "/dashboard"
  ) as Route;

  return <LoginForm nextRoute={nextRoute} />;
}
