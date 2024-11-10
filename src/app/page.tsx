"use client";

import React from "react";
import { useAuth } from "@/app/providers/AppContext";
import RequireAuthToolBar from "./components/RequireAuthToolBar";
import { useRouter } from "next/navigation";
import { StatCard } from "./components/StatCard";
import { MdGroups } from "react-icons/md";       // meeting icon
import { SiGoogletasks } from "react-icons/si";  // completed tasks icon
import { CgFormatLeft } from "react-icons/cg";   // in progress icon
import { ImBlocked } from "react-icons/im";      // blocked tasks icon
import { LuListTodo } from "react-icons/lu";     // remaining tasks icon

export default function Home() {
  const { logout } = useAuth();
  const router = useRouter();

  return (
    <RequireAuthToolBar>
      <div className="min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
        {/* Navigation */}
        <nav className="flex justify-between items-center mb-20">
          <h1 className="font-semibold text-2xl">OneFlow</h1>
          
          <button
            onClick={() => logout()}
            className="hover:text-gray-900 hover:bg-gray-300 h-10 w-20 rounded-lg border-2 hover:border-0"
          >
            Logout
          </button>
        </nav>

        {/* Heading */}
        <div className="text-center mb-20 pt-12">
          <h1 className="text-4xl font-semibold mb-6">
            Transform Your Meetings into<br />Actionable Insights with <span className="bg-gradient-to-r from-fuchsia-400 to-violet-500 inline-block text-transparent bg-clip-text">OneFlow</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Transcribe and Summarize Your Conversations – Effortlessly Organize Key Takeaways and Tasks for Better Productivity.
          </p>
          
          {/* Meeting Button */}
          <div className="pt-8">
            <button 
              onClick={() => router.push("/meetings")}
              className="h-12 w-96 rounded-lg text-lg bg-purple-700 text-primary-foreground hover:bg-purple-700/90 border-purple-900 border-b-4 active:border-b-0"
            >
            View Meetings
            </button>
          </div>
        </div>
        {/* Stat Cards Section */}
        <section className="flex justify-center gap-8 mb-20">
          <StatCard 
            icon={MdGroups}
            number={7}
            heading="Meetings" 
            description="Total number meetings in progress" 
            onClick={() => router.push("/meetings")}
          />
          <StatCard 
            icon={SiGoogletasks}
            number={3} 
            heading="Completed" 
            description="Number of tasks completed" 
            onClick={() => router.push("/users")}
          />
          <StatCard 
            icon={CgFormatLeft}
            number={52} 
            heading="In Progress"
            description="Number of tasks in progress" 
            onClick={() => router.push("/tasks")}
          />
          <StatCard 
            icon={ImBlocked}
            number={38} 
            heading="Blocked" 
            description="Number of tasks dependent on someone else's task(s)" 
            onClick={() => router.push("/tasks")}
          />
          <StatCard 
            icon={LuListTodo}
            number={223} 
            heading="Remaining" 
            description="Number of tasks remaining" 
            onClick={() => router.push("/tasks")}
          />
        </section>
      </div>
    </RequireAuthToolBar>
  );
}
