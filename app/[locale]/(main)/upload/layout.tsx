'use client';

import React, { ReactNode } from 'react';

import ProtectedRoute from '@/layout/protected-route';

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-full w-full flex-col gap-2 overflow-hidden">
      <ProtectedRoute filter>{children}</ProtectedRoute>
    </div>
  );
}
