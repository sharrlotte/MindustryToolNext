import { ArrowLeftCircleIcon, LayoutDashboardIcon } from 'lucide-react';
import React, { ReactNode } from 'react';

import NavLink from '@/app/[locale]/(user)/servers/[id]/nav-link';
import SidebarToggle from '@/app/[locale]/(user)/servers/[id]/sidebar-toggle';
import Divider from '@/components/ui/divider';

import { getSession } from '@/action/action';
import ProtectedElement from '@/layout/protected-element';
import Tran from '@/components/common/tran';
import { CmdIcon, MapIcon, PluginIcon, SettingIcon } from '@/components/common/icons';

type PageProps = {
  params: Promise<{
    id: string;
    locale: string;
  }>;
  children: ReactNode;
};

export default async function Layout({ params, children }: PageProps) {
  const { id } = await params;
  const session = await getSession();

  const links: {
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
      icon: <MapIcon />,
      show: true,
    },
    {
      href: '/plugins',
      label: <Tran text="plugin" />,
      icon: <PluginIcon />,
      show: true,
    },
    {
      href: '/console',
      label: <Tran text="console" />,
      icon: <CmdIcon />,
      show: true,
    },
    {
      href: '/setting',
      label: <Tran text="setting" />,
      icon: <SettingIcon />,
      show: true,
    },
  ];

  return (
    <div className="grid h-full grid-flow-row grid-rows-[auto,1fr] overflow-hidden md:grid-cols-[auto,1fr] md:grid-rows-1">
      <div className="relative flex h-full flex-col flex-wrap bg-card">
        <div className="flex flex-1 flex-wrap gap-2 overflow-x-auto p-2 font-extrabold antialiased md:flex-col md:overflow-x-hidden">
          <div className="flex items-center justify-between gap-1">
            <SidebarToggle />
          </div>
          <Divider className="hidden md:block" />
          {links.map((item) => (
            <ProtectedElement key={item.href} session={session} filter={item.show}>
              <NavLink {...item} id={id} />
            </ProtectedElement>
          ))}
          <div className="mt-auto flex flex-col gap-2">
            <Divider className="hidden md:block" />
            <NavLink id="" href="" label={'Back to server list'} icon={<ArrowLeftCircleIcon className="size-5" />} />
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
