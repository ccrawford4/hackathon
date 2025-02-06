"use client";

import { Fragment, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useTenantId } from "@/app/providers/AppContext";
import { useTheme } from "@/app/providers/ThemeContext";
import { MenuIcon } from 'lucide-react';

interface RequireAuthToolBarProps {
    children: React.ReactNode;
}

export default function RequireAuthToolBar(props: RequireAuthToolBarProps) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const tenantId = useTenantId();
  const { toggleSidebar } = useTheme();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [tenantId, user, router]);

  if (!user) return null;

  return (
    <Fragment>
      <nav className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <MenuIcon className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 flex justify-center">
          <h1 className="font-bold text-2xl text-[#3884ff]">OneFlow</h1>
        </div>

        <div>
          <button
            onClick={() => logout()}
            className="px-4 py-2 text-white bg-black hover:bg-gray-800 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>
      {props.children}
    </Fragment>
  );
}
