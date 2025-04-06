'use client';

import React, { ReactNode } from 'react';

import { useSession } from '@/context/session-context';
import ProtectedRoute from '@/layout/protected-route';

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const { session } = useSession();

  return (
    <div className="flex h-full w-full flex-col gap-2 overflow-hidden">
      <ProtectedRoute session={session} filter={true}>
        {children}
      </ProtectedRoute>
    </div>
  );
}
