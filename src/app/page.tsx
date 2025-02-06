"use client";

import React from "react";
import RequireAuthToolBar from "./components/RequireAuthToolBar";
import { useRouter } from "next/navigation";
import { MdGroups } from "react-icons/md";
import { SiGoogletasks } from "react-icons/si";
import { CgFormatLeft } from "react-icons/cg";
import StatCard from "./components/StatCard";

export default function Home() {
  const router = useRouter();

  return (
    <RequireAuthToolBar>
      <div className="min-h-screen bg-white">
        <div className="max-w-screen-2xl mx-auto px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <StatCard
              icon={MdGroups}
              number={7}
              heading="Users"
              description="Total number of users"
              onClick={() => router.push("/meetings")}
            />
            <StatCard
              icon={SiGoogletasks}
              number={3}
              heading="Completed"
              description="Number of meetings completed"
              onClick={() => router.push("/users")}
            />
            <StatCard
              icon={CgFormatLeft}
              number={52}
              heading="In Progress"
              description="Number of meetings in progress"
              onClick={() => router.push("/tasks")}
            />
          </div>
        </div>
      </div>
    </RequireAuthToolBar>
  );
}
