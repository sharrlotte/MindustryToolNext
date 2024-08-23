import { LayoutDashboardIcon } from 'lucide-react';
import { setStaticParamsLocale } from 'next-international/server';
import React, { ReactNode } from 'react';

import NavLink from '@/app/[locale]/(user)/servers/[id]/nav-link';
import SidebarToggle from '@/app/[locale]/(user)/servers/[id]/sidebar-toggle';
import Divider from '@/components/ui/divider';
import { getI18n } from '@/locales/server';

import {
  ArrowLeftIcon,
  Cog6ToothIcon,
  CommandLineIcon,
  MapIcon,
  PuzzlePieceIcon,
} from '@heroicons/react/24/outline';

type PageProps = {
  params: {
    id: string;
    locale: string;
  };
  children: ReactNode;
};

export default async function Layout({
  params: { id, locale },
  children,
}: PageProps) {
  await setStaticParamsLocale(locale);

  const t = await getI18n();

  const links: {
    href: string;
    label: ReactNode;
    icon: ReactNode;
  }[] = [
    {
      href: '',
      label: t('dashboard'),
      icon: <LayoutDashboardIcon className="size-5" />,
    },
    {
      href: '/maps',
      label: t('map'),
      icon: <MapIcon className="size-5" />,
    },
    {
      href: '/plugins',
      label: t('plugin'),
      icon: <PuzzlePieceIcon className="size-5" />,
    },
    {
      href: '/console',
      label: t('console'),
      icon: <CommandLineIcon className="size-5" />,
    },
    {
      href: '/setting',
      label: t('setting'),
      icon: <Cog6ToothIcon className="size-5" />,
    },
  ];

  return (
    <div className="grid h-full grid-flow-row grid-rows-[auto,1fr] overflow-hidden md:grid-cols-[auto,1fr] md:grid-rows-1">
      <div className="relative flex flex-col flex-wrap bg-card">
        <div className="flex flex-1 flex-wrap gap-2 overflow-x-auto p-2 font-extrabold antialiased md:flex-col md:overflow-x-hidden">
          <div className="flex items-center justify-between gap-1">
            <SidebarToggle />
          </div>
          <Divider className="hidden md:block" />
          {links.map((item) => (
            <NavLink key={item.href} {...item} id={id} />
          ))}
          <div className="mt-auto flex flex-col gap-2">
            <Divider className="hidden md:block" />
            <NavLink
              id=""
              href=""
              label={'Back to server list'}
              icon={<ArrowLeftIcon className="size-5" />}
            />
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
