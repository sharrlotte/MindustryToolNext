import { LayoutDashboardIcon } from 'lucide-react';
import React, { ReactNode } from 'react';
import NavLink from '@/app/[locale]/(user)/servers/[id]/nav-link';
import { getSession } from '@/action/action';
import ProtectedElement from '@/layout/protected-element';
import Tran from '@/components/common/tran';
import { CmdIcon, MapIcon, PluginIcon, SettingIcon } from '@/components/common/icons';

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

type LayoutProps = {
  params: Promise<{
    id: string;
    locale: string;
  }>;
  children: ReactNode;
};

export default async function Layout({ params, children }: LayoutProps) {
  const { id } = await params;
  const session = await getSession();

  return (
    <div className="grid h-full grid-flow-row grid-rows-[auto,1fr] gap-2 overflow-hidden p-2">
      <div className="no-scrollbar flex h-full snap-mandatory snap-x gap-3 overflow-x-auto overflow-y-hidden bg-card px-2">
        {links.map((item) => (
          <ProtectedElement key={item.href} session={session} filter={item.show}>
            <NavLink {...item} id={id} />
          </ProtectedElement>
        ))}
      </div>
      {children}
    </div>
  );
}
