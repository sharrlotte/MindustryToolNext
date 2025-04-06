'use client';

import React, { ReactNode } from 'react';

import { useSession } from '@/context/session-context';
import ProtectedRoute from '@/layout/protected-route';

export default function Layout({ children }: { children: ReactNode }) {
  const { session } = useSession();

  return (
    <ProtectedRoute session={session} filter={true}>
      {children}
    </ProtectedRoute>
  );
}
