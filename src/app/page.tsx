"use client";

import React, { useEffect } from "react";
import RequireAuthToolBar from "./components/RequireAuthToolBar";
import { useRouter } from "next/navigation";
import { MdGroups } from "react-icons/md";
import { SiGoogletasks } from "react-icons/si";
import { CgFormatLeft } from "react-icons/cg";
import StatCard from "./components/StatCard";
import { useAuth, useDatabase } from "./providers/AppContext";
import { listAll } from "@/lib/queries";
import { Meeting } from "@/lib/API";
import { Loader } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const db = useDatabase();
  const { tenantId } = useAuth();
  const [userCount, setUserCount] = React.useState(0);
  const [completedMeetingsCount, setCompletedMeetingsCount] = React.useState(0);
  const [inProgressCount, setInProgressCount] = React.useState(0);
  const [loading, setLoading] = React.useState(false);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await listAll(db, "meetings", tenantId);

      const meetings = response.map((entry) => ({
        id: entry.id,
        data: entry.data as Meeting["data"],
      }));

      setCompletedMeetingsCount(meetings.filter((m) => m.data.endAt).length);
      setInProgressCount(meetings.filter((m) => !m.data.endAt && m.data.startAt).length);

      const users = await listAll(db, "users", tenantId);
      setUserCount(users.length);
      setLoading(false);
    } catch (error) {
      console.error("Error loading stats", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <RequireAuthToolBar>
      <div className="min-h-screen bg-white">
        {loading ? (
          <Loader />
        ) : (
          <div className="max-w-screen-2xl mx-auto px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <StatCard
                icon={MdGroups}
                number={userCount}
                heading="Users"
                description="Total number of users"
                onClick={() => router.push("/users")}
              />
              <StatCard
                icon={SiGoogletasks}
                number={completedMeetingsCount}
                heading="Completed"
                description="Number of meetings completed"
                onClick={() => router.push("/meetings")}
              />
              <StatCard
                icon={CgFormatLeft}
                number={inProgressCount}
                heading="In Progress"
                description="Number of meetings in progress"
                onClick={() => router.push("/meetings")}
              />
            </div>
          </div>
        )}
      </div>
    </RequireAuthToolBar>
  );
}
