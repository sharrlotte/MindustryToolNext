import { LayoutDashboardIcon } from 'lucide-react';
import { setStaticParamsLocale } from 'next-international/server';
import React, { ReactNode } from 'react';

import NavLink from '@/app/[locale]/admin/servers/[id]/nav-link';
import SidebarToggle from '@/app/[locale]/admin/servers/[id]/sidebar-toggle';
import Divider from '@/components/ui/divider';
import { getI18n } from '@/locales/server';

import {
  ArrowLeftIcon,
  Cog6ToothIcon,
  CommandLineIcon,
  FolderIcon,
  MapIcon,
  PuzzlePieceIcon,
} from '@heroicons/react/24/outline';

type PageProps = {
  params: { id: string };
  children: ReactNode;
};

export default async function Layout({ params: { id }, children }: PageProps) {
  await setStaticParamsLocale('en');
  const t = await getI18n();

  const links: {
    href: string;
    label: ReactNode;
    icon: ReactNode;
  }[] = [
    {
      href: '',
      label: t('dashboard'),
      icon: <LayoutDashboardIcon className="h-5 w-5" />,
    },
    {
      href: '/maps',
      label: t('map'),
      icon: <MapIcon className="h-5 w-5" />,
    },
    {
      href: '/plugins',
      label: t('plugin'),
      icon: <PuzzlePieceIcon className="h-5 w-5" />,
    },
    {
      href: '/console',
      label: t('console'),
      icon: <CommandLineIcon className="h-5 w-5" />,
    },
    {
      href: '/files',
      label: t('files'),
      icon: <FolderIcon className="h-5 w-5" />,
    },
    {
      href: '/setting',
      label: t('setting'),
      icon: <Cog6ToothIcon className="h-5 w-5" />,
    },
  ];

  return (
    <div className="grid h-full grid-flow-row grid-rows-[auto,1fr] overflow-hidden md:grid-cols-[auto,1fr] md:grid-rows-1 md:divide-x divide-y md:divide-y-0">
      <div className="flex flex-col flex-wrap relative">
        <div className="flex flex-1 flex-wrap gap-2 overflow-x-auto md:overflow-x-hidden p-2 md:flex-col font-extrabold antialiased">
          <div className="flex gap-1 justify-between items-center">
            <SidebarToggle />
          </div>
          <Divider className="md:block hidden" />
          {links.map((item) => (
            <NavLink key={item.href} {...item} id={id} />
          ))}
          <div className="mt-auto flex flex-col gap-2">
            <Divider className="hidden md:block" />
            <NavLink
              id=""
              href=""
              label={'Back to server list'}
              icon={<ArrowLeftIcon className="h-5 w-5" />}
            />
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
