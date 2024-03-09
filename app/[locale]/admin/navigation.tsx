'use client';

import useClientAPI from '@/hooks/use-client';
import { cn } from '@/lib/utils';
import { useI18n } from '@/locales/client';
import getTotalMapUpload from '@/query/map/get-total-map-upload';
import getTotalPostUpload from '@/query/post/get-total-post-upload';
import getTotalSchematicUpload from '@/query/schematic/get-total-schematic-upload';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { ReactNode } from 'react';

const paths: Array<{
  name: ReactNode;
  path: string;
}> = [
  { name: 'dashboard', path: '' },
  { name: 'log', path: 'logs' },
  { name: <SchematicPath />, path: 'schematics' },
  { name: <MapPath />, path: 'maps' },
  { name: <PostPath />, path: 'posts' },
  { name: 'setting', path: 'settings' },
];

type NavigationProps = {
  children: ReactNode;
};

export default function Navigation({ children }: NavigationProps) {
  let pathname = usePathname();
  let firstSlash = pathname.indexOf('/', 1);
  pathname = pathname.slice(firstSlash);

  return (
    <div className="grid h-full w-full grid-rows-[3rem_1fr] gap-2 p-4">
      <section className="no-scrollbar flex min-h-8 w-full items-center gap-4 overflow-auto rounded-md bg-card p-2 text-sm font-bold capitalize">
        {paths.map(({ name, path }) => (
          <Link
            className={cn('opacity-70', {
              'opacity-100':
                (pathname.includes(path) && path !== '') ||
                (path === '' && pathname === '/admin'),
            })}
            key={path}
            href={`/admin/${path}`}
          >
            {name}
          </Link>
        ))}
      </section>
      {children}
    </div>
  );
}

function SchematicPath() {
  const t = useI18n();
  const { axios } = useClientAPI();
  const { data } = useQuery({
    queryFn: () => getTotalSchematicUpload(axios, {}),
    queryKey: ['total-schematic-uploads'],
  });

  const schematicCount = data ?? 0;

  return (
    <>
      <span>{t('schematic')}</span>
      {schematicCount > 0 && <span>({schematicCount})</span>}
    </>
  );
}
function MapPath() {
  const t = useI18n();
  const { axios } = useClientAPI();
  const { data } = useQuery({
    queryFn: () => getTotalMapUpload(axios, {}),
    queryKey: ['total-map-uploads'],
  });

  const mapCount = data ?? 0;

  return (
    <>
      <span>{t('map')}</span>
      {mapCount > 0 && <span>({mapCount})</span>}
    </>
  );
}
function PostPath() {
  const t = useI18n();
  const { axios } = useClientAPI();
  const { data } = useQuery({
    queryFn: () => getTotalPostUpload(axios, {}),
    queryKey: ['total-post-uploads'],
  });

  const postCount = data ?? 0;

  return (
    <>
      <span>{t('post')}</span>
      {postCount > 0 && <span>({postCount})</span>}
    </>
  );
}
