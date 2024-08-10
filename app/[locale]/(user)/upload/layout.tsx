import React, { ReactNode } from 'react';

import ProtectedRoute from '@/layout/protected-route';
import { getSession } from '@/query/auth';

type LayoutProps = {
  children: ReactNode;
};

export default async function Layout({ children }: LayoutProps) {
  const data = await getSession();

  return (
    <div className="flex h-full w-full flex-col gap-2 overflow-hidden p-4">
      <ProtectedRoute session={data}>{children}</ProtectedRoute>
    </div>
  );
}
