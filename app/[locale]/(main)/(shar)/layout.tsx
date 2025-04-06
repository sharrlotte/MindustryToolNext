'use client';

import React, { ReactNode } from 'react';

import { useSession } from '@/context/session-context';
import ProtectedRoute from '@/layout/protected-route';

type PageProps = {
  children: ReactNode;
};

export default function Layout({ children }: PageProps) {
  const { session } = useSession();

  return (
    <ProtectedRoute session={session} filter={{ role: 'SHAR' }}>
      {children}
    </ProtectedRoute>
  );
}
