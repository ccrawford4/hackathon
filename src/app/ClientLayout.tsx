"use client";

import React from "react";
import { useTheme } from "./providers/ThemeContext";
import SideBar from "./components/SideBar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { showSidebar } = useTheme();
  
  return (
    <div className="flex h-screen">
      {showSidebar && (
        <div className="w-64 h-full border-r bg-white transition-all duration-300 ease-in-out">
         <SideBar />
        </div>
      )}
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
}