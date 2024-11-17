import React, { ReactNode } from 'react';

import { getSession } from '@/action/action';
import ProtectedRoute from '@/layout/protected-route';

type PageProps = {
  children: ReactNode;
};

export default async function Layout({ children }: PageProps) {
  const session = await getSession();

  return (
    <ProtectedRoute session={session} filter={true}>
      {children}
    </ProtectedRoute>
  );
}
