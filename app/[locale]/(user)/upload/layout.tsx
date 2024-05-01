'use client';

import { UserRole } from '@/constant/enum';
import ProtectedElement from '@/layout/protected-element';
import { cn } from '@/lib/utils';
import { useI18n } from '@/locales/client';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { ReactNode } from 'react';

type LayoutProps = {
  children: ReactNode;
};

type TabData = {
  name: string;
  url: string;
  roles?: UserRole[];
};

export default function Layout({ children }: LayoutProps) {
  const pathName = usePathname();
  const segments = pathName.split('/').filter((item) => item);
  const route = segments.length === 3 ? segments[2] : null;

  const { data } = useSession();
  const t = useI18n();

  const tabs: TabData[] = [
    {
      name: t('schematic'),
      url: 'schematic',
    },
    {
      name: t('map'),
      url: 'map',
    },
    {
      name: t('post'),
      url: 'post',
    },
    {
      name: t('plugin'),
      url: 'plugin',
      roles: ['ADMIN'],
    },
  ];

  function render({ name, url }: { name: string; url: string }) {
    return (
      <Link
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
    );
  }

  return (
    <div className="flex h-full w-full flex-col gap-2 overflow-hidden p-4">
      <section className="no-scrollbar flex h-12 w-full items-center gap-2 overflow-y-auto rounded-sm border-border bg-card p-2 text-sm font-bold capitalize">
        {tabs.map(({ name, url, roles }) =>
          roles ? (
            <ProtectedElement key={name} session={data} all={roles}>
              {render({ name, url })}
            </ProtectedElement>
          ) : (
            render({ name, url })
          ),
        )}
      </section>
      {children}
    </div>
  );
}
