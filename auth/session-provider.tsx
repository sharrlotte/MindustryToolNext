'use client';
import { SessionProvider } from 'next-auth/react';
import React, { ReactNode } from 'react';

type PageProps = {
  children: ReactNode;
};

export default function NextSessionProvider({ children }: PageProps) {
  return <SessionProvider>{children}</SessionProvider>;
}
