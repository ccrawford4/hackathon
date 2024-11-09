"use client";

import React from "react";
import { useAuth } from "@/app/providers/AppContext";
import RequireAuthToolBar from "./components/RequireAuthToolBar";
import { useRouter } from "next/navigation";

export default function Home() {
  const { logout } = useAuth();
  const router = useRouter();
  return (
    <RequireAuthToolBar>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <button onClick={() => logout()}>Logout</button>
        <button onClick={() => router.push("/meetings")}>View Meetings</button>
      </div>
    </RequireAuthToolBar>
  );
}
