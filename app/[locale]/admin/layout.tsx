import { auth } from '@/auth/config';
import ProtectedRoute from '@/components/layout/protected-route';
import Link from 'next/link';
import React, { ReactNode } from 'react';

type PageProps = {
  children: ReactNode;
};

const paths = [
  { name: 'dashboard', path: '' },
  { name: 'log', path: 'logs' },
  { name: 'schematic', path: 'schematics' },
  { name: 'map', path: 'maps' },
  { name: 'post', path: 'posts' },
  { name: 'setting', path: 'settings' },
];

export default async function Layout({ children }: PageProps) {
  const session = await auth();

  return (
    <ProtectedRoute session={session} all={['ADMIN']}>
      <div className="flex h-full w-full flex-col gap-2 p-2">
        <div className="no-scrollbar flex min-h-8 w-full items-center gap-4 overflow-x-auto rounded-sm border-border bg-zinc-900 p-2 text-sm font-thin capitalize">
          {paths.map(({ name, path }) => (
            <Link key={name} href={`/admin/${path}`}>
              {name}
            </Link>
          ))}
        </div>
        {children}
      </div>
    </ProtectedRoute>
  );
}
