'use client';

import ProtectedRoute from '@/layout/protected-route';
import { useSession } from 'next-auth/react';
import React, { ReactNode } from 'react';

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const { data } = useSession();

  return (
    <div className="flex h-full w-full flex-col gap-2 overflow-hidden p-4">
      <ProtectedRoute session={data}>{children}</ProtectedRoute>
    </div>
  );
}
