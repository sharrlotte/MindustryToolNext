'use client';

import ColorText from '@/components/common/color-text';
import { Skeleton } from '@/components/ui/skeleton';
import useClientAPI from '@/hooks/use-client';
import useSafeParam from '@/hooks/use-safe-param';
import { cn } from '@/lib/utils';
import { useI18n } from '@/locales/client';
import getInternalServer from '@/query/server/get-internal-server';
import {
  Cog6ToothIcon,
  CommandLineIcon,
  FolderIcon,
  MapIcon,
  PuzzlePieceIcon,
} from '@heroicons/react/24/outline';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { ReactNode } from 'react';

type PageProps = {
  children: ReactNode;
};

export default function Layout({ children }: PageProps) {
  const t = useI18n();

  const id = useSafeParam().get('id');
  let pathname = usePathname();
  let firstSlash = pathname.indexOf('/', 1);
  pathname = pathname.slice(firstSlash);

  const { axios, enabled } = useClientAPI();

  const { data: server } = useQuery({
    queryKey: ['internal-servers', id],
    queryFn: () => getInternalServer(axios, { id }),
    enabled,
  });

  const links: {
    href: string;
    label: ReactNode;
  }[] = [
    {
      href: '',
      label: (
        <>
          <MapIcon className="h-6 w-6" />
          <span>{t('dashboard')}</span>
        </>
      ),
    },
    {
      href: '/maps',
      label: (
        <>
          <MapIcon className="h-6 w-6" />
          <span>{t('map')}</span>
        </>
      ),
    },
    {
      href: '/plugins',
      label: (
        <>
          <PuzzlePieceIcon className="h-6 w-6" />
          <span>{t('plugin')}</span>
        </>
      ),
    },
    {
      href: '/console',
      label: (
        <>
          <CommandLineIcon className="h-6 w-6" />
          <span>{t('console')}</span>
        </>
      ),
    },
    {
      href: '/files',
      label: (
        <>
          <FolderIcon className="h-6 w-6" />
          <span>{t('files')}</span>
        </>
      ),
    },
    {
      href: '/setting',
      label: (
        <>
          <Cog6ToothIcon className="h-6 w-6" />
          <span>{t('setting')}</span>
        </>
      ),
    },
  ];

  const serverName = server?.name;

  return (
    <div className="grid h-full grid-flow-row grid-rows-[auto,1fr] gap-2 overflow-hidden rounded-md md:grid-cols-[auto,1fr] md:grid-rows-1">
      <div className="flex min-w-48 flex-col flex-wrap gap-2">
        <h2 className="max-w-72 text-ellipsis bg-card px-4 py-2 text-3xl font-bold">
          {serverName ? (
            <ColorText text={serverName} />
          ) : (
            <Skeleton className="h-9 w-full rounded-none" />
          )}
        </h2>
        <div className="flex min-w-48 flex-1 flex-wrap gap-2 overflow-x-auto bg-card p-2 md:flex-col">
          {links.map(({ href, label }) => (
            <Link
              className={cn(
                'flex text-nowrap px-2 py-2 text-sm font-semibold opacity-70',
                {
                  'rounded-sm bg-button text-white opacity-100':
                    (pathname.includes(href) && href !== '') ||
                    (href === '' && pathname === `/admin/servers/${id}`),
                },
              )}
              key={href}
              href={`/admin/servers/${id}/${href}`}
            >
              <div className="flex items-center gap-2">{label}</div>
            </Link>
          ))}
        </div>
      </div>
      {children}
    </div>
  );
}
