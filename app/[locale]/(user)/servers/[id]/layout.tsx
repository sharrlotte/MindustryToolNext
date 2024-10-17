'use client';

import { LayoutDashboardIcon } from 'lucide-react';
import React, { ReactNode, useState } from 'react';
import NavLink from '@/app/[locale]/(user)/servers/[id]/nav-link';
import ProtectedElement from '@/layout/protected-element';
import Tran from '@/components/common/tran';
import { CmdIcon, MapIcon, PluginIcon, SettingIcon } from '@/components/common/icons';
import { useSession } from '@/context/session-context.client';

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
  }>;
  children: ReactNode;
};

export default function Layout({ params, children }: LayoutProps) {
  const { id } = React.use(params);
  const { session } = useSession();
  const [hovered, setHovered] = useState<string>('Yes this is empty');

  return (
    <div className="grid h-full grid-flow-row grid-rows-[auto,1fr] gap-2 overflow-hidden p-2">
      <div
        className="no-scrollbar flex h-full gap-3 overflow-x-auto bg-card px-2"
        onMouseLeave={() => setHovered('Yes this is empty')}
        onTouchCancel={() => setHovered('Yes this is empty')}
      >
        {links.map((item) => (
          <ProtectedElement key={item.href} session={session} filter={item.show}>
            <NavLink {...item} id={id} hovered={hovered} setHovered={setHovered} />
          </ProtectedElement>
        ))}
      </div>
      {children}
    </div>
  );
}
