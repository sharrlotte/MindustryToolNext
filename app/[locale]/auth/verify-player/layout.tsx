import { getSession } from '@/action/action';
import ProtectedRoute from '@/layout/protected-route';

import React, { ReactNode } from 'react';

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await getSession();

  return <ProtectedRoute session={session}>{children}</ProtectedRoute>;
}
