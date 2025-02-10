"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "./providers/ThemeContext";
import SideBar from "./components/SideBar";
import * as api from "@/lib/API";
import { getObject } from "@/lib/queries";
import { useAuth, useDatabase } from "./providers/AppContext";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { showSidebar, toggleSidebar } = useTheme();
  const { userId } = useAuth();
  const db = useDatabase();
  const [user, setUser] = useState<api.CustomUser | null>(null);

  const loadUser = async () => {
    try {
      const user = await getObject(db, "users", userId) as api.CustomUser;
      console.log("User: ", user);
      console.log("User ID: ", userId);
      setUser(user);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <div className="relative h-screen">
      <div
        className={`fixed inset-0 bg-black z-40 transition-opacity duration-500 ease-in-out ${
          showSidebar
            ? "opacity-20 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleSidebar}
      />
      <div
        className={`fixed top-0 left-0 h-full w-64 border-r bg-white z-50 shadow-lg transition-transform duration-500 ease-in-out ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SideBar user={user} />
      </div>

      <main className="w-full">{children}</main>
    </div>
  );
}
