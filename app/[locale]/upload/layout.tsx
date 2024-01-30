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
    <div className="flex flex-col gap-2 p-4">
      <section className="grid w-fit grid-flow-col gap-2 rounded-md border border-border p-2">
        {tabs.map(({ name, url }) => (
          <Link
            key={name}
            className={cn(
              'flex min-w-16 items-center justify-center gap-3 rounded-md bg-opacity-0 px-1 py-2 opacity-80 transition-colors duration-300 hover:bg-emerald-500 hover:opacity-100',
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
