import { auth } from '@/auth/config';
import ProtectedRoute from '@/layout/protected-route';
import Link from 'next/link';
import React, { ReactNode } from 'react';

type PageProps = {
  children: ReactNode;
};

const paths = [
  { name: 'dashboard', path: '' },
  { name: 'logs', path: 'logs' },
  { name: 'schematics', path: 'schematics' },
  { name: 'maps', path: 'maps' },
  { name: 'posts', path: 'posts' },
  { name: 'settings', path: 'settings' },
];

export default async function Layout({ children }: PageProps) {
  const session = await auth();

  return (
    <ProtectedRoute session={session} all={['ADMIN']}>
      <div className="grid h-full w-full grid-rows-[3rem_1fr] gap-2 p-2">
        <section className="no-scrollbar flex min-h-8 w-full items-center gap-4 overflow-auto rounded-sm border-border bg-card p-2 text-sm font-bold capitalize">
          {paths.map(({ name, path }) => (
            <Link key={name} href={`/admin/${path}`}>
              {name}
            </Link>
          ))}
        </section>
        {children}
      </div>
    </ProtectedRoute>
  );
}
