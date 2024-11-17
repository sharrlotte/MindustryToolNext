import React, { ReactNode } from 'react';

import { getSession } from '@/action/action';
import ProtectedRoute from '@/layout/protected-route';

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await getSession();

  return (
    <ProtectedRoute session={session} filter={true}>
      {children}
    </ProtectedRoute>
  );
}
