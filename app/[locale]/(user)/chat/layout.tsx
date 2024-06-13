import React, { ReactNode } from 'react';

import ProtectedRoute from '@/layout/protected-route';
import getSession from '@/query/auth/get-session';

type LayoutProps = {
  children: ReactNode;
};

export default async function Layout({ children }: LayoutProps) {
  const data = await getSession();

  return <ProtectedRoute session={data}>{children}</ProtectedRoute>;
}
