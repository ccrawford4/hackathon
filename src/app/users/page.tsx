"use client";

import React, { useState, useEffect } from "react";
import RequireAuthToolBar from "../components/RequireAuthToolBar";
import { MoreVertical } from "lucide-react";
import { useDatabase, useTenantId, useUserId } from "../providers/AppContext";
import { getTenantFromId } from "@/lib/queries";
import * as api from "@/lib/API";
import { getUsers } from "@/lib/helpers";
import { Avatar, Modal, TextField } from "@mui/material";
import { createObject, deleteObject } from "@/lib/mutations";

export default function Users() {
  const tenantId = useTenantId();
  const [tenant, setTenant] = useState<api.Tenant>();
  const db = useDatabase();
  const [users, setUsers] = useState<api.CustomUser[]>([]);
  const userId = useUserId();
  const [openAddUserModal, setOpenAddUserModal] = useState(false);
  const [admin, setAdmin] = useState<api.CustomUser>();
  const [error, setError] = useState<string>();
  const [newUserEmail, setNewUserEmail] = useState<string>();
  const [selectedUsers, setSelectedUsers] = useState<api.CustomUser[]>([]);

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
    setAdmin(users.find((user) => user.id === userId));
    setUsers(
      users.filter(
        (user) =>
          user.id !== userId &&
          user.data.firstName !== "" &&
          user.data.lastName !== ""
      )
    );
  };

  useEffect(() => {
    loadPageDetails();
  }, []);

  const handleAddUser = async () => {
    try {
      if (!newUserEmail || newUserEmail === "") {
        setError("Please enter a valid email address.");
        return;
      }
      if (users.find((user) => user.data.email === newUserEmail)) {
        setError("User already exists.");
        return;
      }

      const response = await createObject(db, "users", {
        data: {
          email: newUserEmail,
          firstName: "",
          lastName: "",
          profileURL: "",
          tenantId: tenantId,
        },
      });

      alert(
        "The user has been added successfully. Once they log in to the organization their information will be displayed here."
      );

      console.log("response: ", response);
      setOpenAddUserModal(false);
      setNewUserEmail("");
    } catch (e) {
      console.error(e);
      setError("An error occurred. Please try again.");
    }
  };

  const handleCheckUser = (user: api.CustomUser) => {
    if (
      selectedUsers.filter((findUser) => findUser.id === user.id).length > 0
    ) {
      setSelectedUsers(
        selectedUsers.filter((findUser) => findUser.id !== user.id)
      );
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleRemoveUsers = async () => {
    const confirm = window.confirm(
      "Are you sure you want to remove the selected users?"
    );
    if (!confirm) {
      return;
    }
    try {
      const promises = selectedUsers.map((user) => {
        return deleteObject(db, "users", user.id);
      });

      await Promise.all(promises);
      setSelectedUsers([]);
      loadPageDetails();
    } catch (e) {
      console.error(e);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <RequireAuthToolBar>
      <Modal
        open={openAddUserModal}
        className="pos-fixed items-center justify-center flex inset-0"
        onClose={() => setOpenAddUserModal(false)}
      >
        <div className="w-[350px] flex-col items-center justify-center bg-white p-6 rounded-lg">
          <p className="text-gray-600 mb-4">Add a new user to your team.</p>
          <TextField
            className="w-[300px]"
            id="outlined-basic"
            label="Email"
            variant="outlined"
            onChange={(e) => setNewUserEmail(e.target.value)}
          />
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          <button
            onClick={handleAddUser}
            className="px-4 py-2 bg-black text-white rounded-lg mt-4"
          >
            Submit
          </button>
        </div>
      </Modal>

      <div className="min-h-screen bg-white p-8 font-[family-name:var(--font-geist-sans)]">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm justify-between w-full text-gray-600 mb-6">
          <div className="gap-4">
            <span>{tenant?.data.name}</span>
            <span className="pl-1">/</span>
            <span className="pl-1">User management</span>
          </div>

          <div className="flex items-right gap-2 bg-gray-200 px-3 py-2 rounded-lg">
            <Avatar
              src={admin?.data.profileURL}
              alt={`${admin?.data.firstName} ${admin?.data.lastName}`}
              className="ring-2 ring-[#7000FF]"
            />
            <div className="flex flex-col">
              <span className="text-black text-sm font-medium">
                {admin?.data.firstName} {admin?.data.lastName}
              </span>
              <span className="text-xs text-gray-500">Administrator</span>
            </div>
          </div>
        </div>

        {/* Page Title */}
        <h1 className="text-2xl text-black font-semibold mb-2">
          User management
        </h1>
        <p className="text-gray-600 mb-8">Manage your team members here.</p>

        {/* Controls */}
        <div className="flex justify-between items-center mb-6 text-black">
          <div className="flex items-center gap-2">
            <h2 className="font-medium">All users</h2>
            <span className="text-gray-500">{users.length}</span>
          </div>
          <div className="flex items-center gap-3">
            {selectedUsers.length > 0 && (
              <button
                onClick={handleRemoveUsers}
                className="px-4 py-2 bg-red-200 hover:bg-red-300 text-black rounded-lg"
              >
                Remove Selected Users
              </button>
            )}
            <button
              onClick={() => setOpenAddUserModal(true)}
              className="px-4 py-2 bg-black text-white rounded-lg"
            >
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
                  <input
                    onChange={() => {
                      if (selectedUsers.length === users.length) {
                        setSelectedUsers([]);
                      } else {
                        setSelectedUsers(users);
                      }
                    }}
                    type="checkbox"
                    className="rounded"
                    checked={selectedUsers.length === users.length}
                  />
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
                    <input
                      checked={
                        selectedUsers.filter(
                          (findUser) => findUser.id === user.id
                        ).length > 0
                      }
                      onChange={() => handleCheckUser(user)}
                      type="checkbox"
                      className="rounded"
                    />
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
                        <div className="font-medium text-black">
                          {user.data.firstName + " " + user.data.lastName}
                        </div>
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
