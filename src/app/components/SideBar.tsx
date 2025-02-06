import React from "react";
import {
  Settings,
  Users,
  Calendar,
  Database,
  Bell,
  Lock,
  Key,
  CreditCard,
  Download,
  Upload,
  Globe,
  FileText,
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
                  <li>
                    <button className="flex items-center w-full px-2 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
                      <Bell className="w-5 h-5 mr-3" />
                      <span>Notifications</span>
                      <span className="ml-auto bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                        4
                      </span>
                    </button>
                  </li>
                </ul>
              </div>

              <div className="mb-4">
                <div className="text-xs font-semibold text-gray-500 mb-2">
                  SETTINGS
                </div>
                <ul className="space-y-2">
                  <li>
                    <button className="flex items-center w-full px-2 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
                      <Lock className="w-5 h-5 mr-3" />
                      <span>Security & access</span>
                    </button>
                  </li>
                  <li>
                    <button className="flex items-center w-full px-2 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
                      <Key className="w-5 h-5 mr-3" />
                      <span>Authentication</span>
                    </button>
                  </li>
                  <li>
                    <button className="flex items-center w-full px-2 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
                      <CreditCard className="w-5 h-5 mr-3" />
                      <span>Payments</span>
                    </button>
                  </li>
                  <li>
                    <button className="flex items-center w-full px-2 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
                      <Download className="w-5 h-5 mr-3" />
                      <span>Import data</span>
                    </button>
                  </li>
                  <li>
                    <button className="flex items-center w-full px-2 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
                      <Upload className="w-5 h-5 mr-3" />
                      <span>Export data</span>
                    </button>
                  </li>
                </ul>
              </div>

              <div className="mb-4">
                <ul className="space-y-2">
                  <li>
                    <button className="flex items-center w-full px-2 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
                      <Settings className="w-5 h-5 mr-3" />
                      <span>Settings</span>
                    </button>
                  </li>
                  <li>
                    <button className="flex items-center w-full px-2 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
                      <FileText className="w-5 h-5 mr-3" />
                      <span>Documentation</span>
                    </button>
                  </li>
                  <li>
                    <button className="flex items-center w-full px-2 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
                      <Globe className="w-5 h-5 mr-3" />
                      <span>Open in browser</span>
                    </button>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
    )
}