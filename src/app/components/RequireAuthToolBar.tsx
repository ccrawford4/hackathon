"use client";

import { Fragment, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from "@/app/providers/AppContext";

interface RequireAuthToolBarProps {
    children: React.ReactNode;
}
export default function RequireAuthToolBar(props: RequireAuthToolBarProps) {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) return null; // If not authenticated, don't render anything

  return (
    <Fragment>
        {props.children}
    </Fragment>
  );
}
