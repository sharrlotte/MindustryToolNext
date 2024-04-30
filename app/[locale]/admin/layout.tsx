import Navigation from '@/app/[locale]/admin/navigation';
import { auth } from '@/auth/config';
import ProtectedRoute from '@/layout/protected-route';
import React, { ReactNode } from 'react';

type PageProps = {
  children: ReactNode;
};

export default async function Layout({ children }: PageProps) {
  const session = await auth();

  return (
    <ProtectedRoute session={session} all={['ADMIN']}>
      <Navigation>{children}</Navigation>
    </ProtectedRoute>
  );
}
