import ProtectedRoute from '@/layout/protected-route';
import getSession from '@/query/auth/get-session';

import React, { ReactNode } from 'react';

type PageProps = {
  children: ReactNode;
};

export default async function Layout({ children }: PageProps) {
  const session = await getSession();

  return (
    <ProtectedRoute session={session} all={['ADMIN']}>
      {children}
    </ProtectedRoute>
  );
}
