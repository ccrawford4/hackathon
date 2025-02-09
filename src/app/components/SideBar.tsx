import React from "react";
import { Users, Calendar, Database, MenuIcon, LogOut } from "lucide-react";
import { useTheme } from "../providers/ThemeContext";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../providers/AppContext";

export default function SideBar() {
  const { toggleSidebar } = useTheme();
  const { logout } = useAuth();
  const path = usePathname();
  const router = useRouter();

  const sectionClassName = (activePath: string) => {
    return `
      flex items-center w-full px-2 py-2 
      text-${path === activePath ? "black": "gray-500"} 
      rounded-lg hover:bg-gray-100
      font-${path === activePath ? "bold": "normal"}
    `;
  }

  const handleSectionClick = (path: string) => {
    toggleSidebar();
    router.push(path);
  };

  const handleLogout = () => {
    toggleSidebar();
    logout();
  }

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
              <button className={sectionClassName("/")} onClick={() => handleSectionClick("/")}>
                <Database className="w-5 h-5 mr-3" />
                <span>Dashboard</span>
              </button>
            </li>
            <li>
            <button className={sectionClassName("/users")} onClick={() => handleSectionClick("/users")}>
                <Users className="w-5 h-5 mr-3" />
                <span>User management</span>
              </button>
            </li>
            <li>
            <button className={sectionClassName("/meetings")} onClick={() => handleSectionClick("/meetings")}>
                <Calendar className="w-5 h-5 mr-3" />
                <span>Meetings</span>
              </button>
            </li>
          </ul>
        </div>
      </nav>
      <div className="border-t border-gray-200 p-4">
        <button 
          onClick={handleLogout}
          className="flex items-center w-full px-2 py-2 text-gray-500 rounded-lg hover:bg-gray-100 text-black"
        >
          <LogOut color="black" className="w-5 h-5 mr-2" /> <span className="text-black font-semibold">Log Out</span>
        </button>
      </div>
    </div>
  );
}
