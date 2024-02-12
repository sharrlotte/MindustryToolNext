'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { ReactNode } from 'react';

type LayoutProps = {
  children: ReactNode;
};

type TabData = {
  name: string;
  url: string;
};

const tabs: TabData[] = [
  {
    name: 'Schematic',
    url: 'schematic',
  },
  {
    name: 'Map',
    url: 'map',
  },
  {
    name: 'Post',
    url: 'post',
  },
];

export default function Layout({ children }: LayoutProps) {
  const pathName = usePathname();
  const segments = pathName.split('/').filter((item) => item);
  const route = segments.length === 3 ? segments[2] : null;

  return (
    <div className="flex h-full w-full flex-col gap-2 p-4">
      <section className="no-scrollbar flex w-full items-center gap-2 overflow-auto rounded-sm border-border bg-card p-2 text-sm font-bold capitalize">
        {tabs.map(({ name, url }) => (
          <Link
            key={name}
            className={cn(
              'flex min-w-16 items-center justify-center rounded-sm p-2 opacity-80 transition-colors duration-300 hover:bg-button hover:text-background hover:opacity-100 dark:hover:text-foreground',
              {
                'bg-button bg-opacity-100 text-background opacity-100 dark:text-foreground':
                  route === url,
              },
            )}
            href={`/upload/${url}`}
          >
            {name}
          </Link>
        ))}
      </section>
      {children}
    </div>
  );
}
