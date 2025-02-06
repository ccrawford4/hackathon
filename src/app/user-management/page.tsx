import React from "react";
import RequireAuthToolBar from "../components/RequireAuthToolBar";
export default function UserManagement() {
  return (
    <RequireAuthToolBar>
      <div className="min-h-screen bg-white p-8 font-[family-name:var(--font-geist-sans)]">
        <div className="flex h-screen bg-gray-50">
          {/* Main Content */}
          <div className="flex-1 overflow-auto">
            {/* Header */}
            <header className="bg-white border-b p-4 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className="text-xl text-black font-semibold">
                  User management
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  placeholder="Search"
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button className="px-4 py-2 bg-[#3884ff] text-white rounded-lg hover:bg-purple-700">
                  Add user
                </button>
              </div>
            </header>

            {/* Main Content Area */}
            <main className="p-6">
              <div className="bg-white rounded-lg shadow">
                {/* Add your main content here */}
              </div>
            </main>
          </div>
        </div>
      </div>
    </RequireAuthToolBar>
  );
}
