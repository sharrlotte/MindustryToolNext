import React, { ReactNode } from 'react';

import ProtectedRoute from '@/layout/protected-route';

export default function Layout({ children }: { children: ReactNode }) {
  return <ProtectedRoute filter={true}>{children}</ProtectedRoute>;
}
