import { LayoutDashboardIcon } from 'lucide-react';
import { setStaticParamsLocale } from 'next-international/server';
import React, { ReactNode } from 'react';

import NavLink from '@/app/[locale]/(user)/servers/[id]/nav-link';
import SidebarToggle from '@/app/[locale]/(user)/servers/[id]/sidebar-toggle';
import Divider from '@/components/ui/divider';

import {
  ArrowLeftIcon,
  Cog6ToothIcon,
  CommandLineIcon,
  MapIcon,
  PuzzlePieceIcon,
} from '@heroicons/react/24/outline';
import { getSession } from '@/action/action';
import ProtectedElement from '@/layout/protected-element';
import Tran from '@/components/common/tran';

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

  const session = await getSession();

  let links: {
    href: string;
    label: ReactNode;
    icon: ReactNode;
    show: boolean;
  }[] = [
    {
      href: '',
      label: <Tran text="dashboard" />,
      icon: <LayoutDashboardIcon className="size-5" />,
      show: true,
    },
    {
      href: '/maps',
      label: <Tran text="map" />,
      icon: <MapIcon className="size-5" />,
      show: true,
    },
    {
      href: '/plugins',
      label: <Tran text="plugin" />,
      icon: <PuzzlePieceIcon className="size-5" />,
      show: true,
    },
    {
      href: '/console',
      label: <Tran text="console" />,
      icon: <CommandLineIcon className="size-5" />,
      show: true,
    },
    {
      href: '/setting',
      label: <Tran text="setting" />,
      icon: <Cog6ToothIcon className="size-5" />,
      show: true,
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
            <ProtectedElement
              key={item.href}
              session={session}
              show={item.show}
            >
              <NavLink {...item} id={id} />
            </ProtectedElement>
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
