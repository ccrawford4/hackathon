"use client";

import React, { useState, useEffect } from "react";
import RequireAuthToolBar from "../components/RequireAuthToolBar";
import { MoreVertical } from 'lucide-react';
import { useDatabase, useTenantId, useUserId } from "../providers/AppContext";
import { getTenantFromId } from "@/lib/queries";
import * as api from "@/lib/API";
import { getUsers } from "@/lib/helpers";
import { Avatar } from "@mui/material";

export default function Users() {
  const tenantId = useTenantId();
  const [tenant, setTenant] = useState<api.Tenant>();
  const db = useDatabase();
  const [users, setUsers] = useState<api.CustomUser[]>([]);
  const userId = useUserId();

  const loadPageDetails = async () => {
    const tenant = await getTenantFromId(db, tenantId as string);
    if (!tenant) {
      throw new Error("Tenant not found");
    }
    setTenant(tenant);

    // Load users
    const users = await getUsers(db, tenantId as string);
    if (!users) {
      throw new Error("Users not found");
    }
    setUsers(users.filter((user) => user.id !== userId));
  };

  useEffect(() => {
    loadPageDetails();
  }, []);

  return (
    <RequireAuthToolBar>
      <div className="min-h-screen bg-white p-8 font-[family-name:var(--font-geist-sans)]">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <span>{tenant?.data.name}</span>
          <span>/</span>
          <span>User management</span>
        </div>

        {/* Page Title */}
        <h1 className="text-2xl text-black font-semibold mb-2">User management</h1>
        <p className="text-gray-600 mb-8">
          Manage your team members and their account permissions here.
        </p>

        {/* Controls */}
        <div className="flex justify-between items-center mb-6 text-black">
          <div className="flex items-center gap-2">
            <h2 className="font-medium">All users</h2>
            <span className="text-gray-500">{users.length}</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-black text-white rounded-lg">
              Add user
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-sm">
                <th className="p-4 text-left w-8">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="p-4 text-left font-medium text-gray-600">
                  Users
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <input type="checkbox" className="rounded" />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                    <Avatar
                        key={index}
                        src={user.data.profileURL}
                        alt={`${user.data.firstName} ${user.data.lastName}`}
                        className={"ring-2 ring-[#7000FF]"}
                      />
                      <div>
                        <div className="font-medium">{user.data.firstName + " " + user.data.lastName}</div>
                        <div className="text-sm text-gray-500">
                          {user.data.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 text-gray-600">{user.data.createdAt}</td>
                  <td className="p-4">
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </RequireAuthToolBar>
  );
}
