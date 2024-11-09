"use client";

import { Fragment, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useTenantId } from "@/app/providers/AppContext";

interface RequireAuthToolBarProps {
    children: React.ReactNode;
}
export default function RequireAuthToolBar(props: RequireAuthToolBarProps) {
  const router = useRouter();
  const { user } = useAuth();
  const tenantId = useTenantId();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [tenantId, user, router]);

  if (!user) return null; // If not authenticated, don't render anything

  return (
    <Fragment>
        {props.children}
    </Fragment>
  );
}
