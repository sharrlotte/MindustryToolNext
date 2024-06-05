import { auth } from '@/auth/config';
import ProtectedRoute from '@/layout/protected-route';
import React, { ReactNode } from 'react';

type LayoutProps = {
  children: ReactNode;
};

export default async function Layout({ children }: LayoutProps) {
  const data = await auth();

  return (
    <div className="flex h-full w-full flex-col gap-2 overflow-hidden p-4">
      <ProtectedRoute session={data}>{children}</ProtectedRoute>
    </div>
  );
}
