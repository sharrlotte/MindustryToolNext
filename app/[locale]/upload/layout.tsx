'use client';

import { Button } from '@/components/ui/button';
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
      <section className="no-scrollbar flex min-h-14 w-full items-center gap-2 overflow-auto rounded-sm border-border bg-card p-2 text-sm font-bold capitalize">
        {tabs.map(({ name, url }) => (
          <Link
            key={name}
            className={cn(
              'flex items-center justify-center gap-3 rounded-md bg-opacity-0 p-2 opacity-80 transition-colors duration-300 hover:bg-emerald-500 hover:opacity-100',
              {
                'bg-emerald-500 bg-opacity-100 opacity-100': route === url,
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
