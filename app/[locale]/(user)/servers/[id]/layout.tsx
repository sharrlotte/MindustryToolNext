'use client';

import { LayoutDashboardIcon } from 'lucide-react';
import React, { ReactNode, useState } from 'react';

import NavLink from '@/app/[locale]/(user)/servers/[id]/nav-link';

import { CmdIcon, MapIcon, PluginIcon, SettingIcon } from '@/components/common/icons';
import Tran from '@/components/common/tran';

import { useSession } from '@/context/session-context.client';
import ProtectedElement from '@/layout/protected-element';

const links: {
  id: string;
  href: string;
  label: ReactNode;
  icon: ReactNode;
}[] = [
  {
    id: 'dashboard',
    href: '',
    label: <Tran text="dashboard" />,
    icon: <LayoutDashboardIcon className="size-5" />,
  },
  { id: 'map', href: '/maps', label: <Tran text="map" />, icon: <MapIcon /> },
  {
    id: 'plugin',
    href: '/plugins',
    label: <Tran text="plugin" />,
    icon: <PluginIcon />,
  },
  {
    id: 'console',
    href: '/console',
    label: <Tran text="console" />,
    icon: <CmdIcon />,
  },
  { id: 'setting', href: '/setting', label: <Tran text="setting" />, icon: <SettingIcon /> },
];

type LayoutProps = {
  params: Promise<{
    id: string;
  }>;
  children: ReactNode;
};

export default function ServerLayout({ params, children }: LayoutProps) {
  const { id } = React.use(params);
  const { session } = useSession();
  const [hovered, setHovered] = useState<string>('Yes this is empty');

  return (
    <div className="grid h-full grid-flow-row grid-rows-[auto,1fr] gap-2 overflow-hidden p-2">
      <div className="no-scrollbar flex h-full gap-3 overflow-x-auto bg-card px-2" onMouseLeave={() => setHovered('Yes this is empty')} onTouchCancel={() => setHovered('Yes this is empty')}>
        {links.map((item) => (
          <ProtectedElement key={item.id} session={session} filter={true}>
            <NavLink {...item} root={`servers/${id}`} hovered={hovered} setHovered={setHovered} />
          </ProtectedElement>
        ))}
      </div>
      <div className="h-full w-full overflow-hidden flex flex-col" key="child">
        {children}
      </div>
    </div>
  );
}
