"use client";

import React from "react";
import { useTheme } from "./providers/ThemeContext";
import SideBar from "./components/SideBar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { showSidebar, toggleSidebar } = useTheme();
  
  return (
    <div className="relative h-screen">
      {showSidebar && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40" onClick={toggleSidebar} />
          <div className="fixed top-0 left-0 h-full w-64 border-r bg-white z-50 shadow-lg transition-transform duration-300 ease-in-out">
            <SideBar />
          </div>
        </>
      )}
      <main className="w-full">
        {children}
      </main>
    </div>
  );
}