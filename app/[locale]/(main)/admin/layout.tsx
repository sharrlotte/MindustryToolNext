import React, { ReactNode } from 'react';

import ProtectedRoute from '@/layout/protected-route';

type PageProps = {
  children: ReactNode;
};

export default function Layout({ children }: PageProps) {
  return <ProtectedRoute filter>{children}</ProtectedRoute>;
}
