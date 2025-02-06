import React from "react";
import {
  Users,
  Calendar,
  Database,
  MenuIcon,
} from "lucide-react";
import { useTheme } from "../providers/ThemeContext";

export default function SideBar() {
  const { toggleSidebar } = useTheme();
    return (
        <div className="w-64 bg-white border-r">
          <div className="pl-4 pt-2">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <MenuIcon className="h-6 w-6 text-gray-600" />
          </button>
          </div>
            {/* Sidebar Navigation */}
            <nav className="p-4">
              <div className="mb-4">
                <div className="text-xs font-semibold text-gray-500 mb-2">
                  GENERAL
                </div>
                <ul className="space-y-2">
                  <li>
                    <button className="flex items-center w-full px-2 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
                      <Database className="w-5 h-5 mr-3" />
                      <span>Dashboard</span>
                    </button>
                  </li>
                  <li>
                    <button className="flex items-center w-full px-2 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
                      <Users className="w-5 h-5 mr-3" />
                      <span>User management</span>
                    </button>
                  </li>
                  <li>
                    <button className="flex items-center w-full px-2 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
                      <Calendar className="w-5 h-5 mr-3" />
                      <span>Meetings</span>
                    </button>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
    )
}