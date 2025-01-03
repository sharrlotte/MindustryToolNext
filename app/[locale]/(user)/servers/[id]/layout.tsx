'use client';

import React, { ReactNode, useState } from 'react';



import NavLink from '@/app/[locale]/(user)/servers/[id]/nav-link';



import { CmdIcon, FileIcon, LayoutDashboardIcon, MapIcon, PluginIcon, SettingIcon } from '@/components/common/icons';
import Tran from '@/components/common/tran';



import { useSession } from '@/context/session-context.client';
import ProtectedElement from '@/layout/protected-element';
import { Filter } from '@/lib/utils';


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

  const links: {
    id: string;
    href: string;
    label: ReactNode;
    icon: ReactNode;
    filter?: Filter;
  }[] = [
    {
      id: 'dashboard',
      href: '',
      label: <Tran text="dashboard" />,
      icon: <LayoutDashboardIcon className="size-5" />,
    },
    { id: 'map', href: '/maps', label: <Tran text="map" />, icon: <MapIcon />, filter: { any: [{ authority: 'UPDATE_SERVER' }, { authorId: id }] } },
    {
      id: 'plugin',
      href: '/plugins',
      label: <Tran text="plugin" />,
      icon: <PluginIcon />,
      filter: { any: [{ authority: 'UPDATE_SERVER' }, { authorId: id }] },
    },
    {
      id: 'console',
      href: '/console',
      label: <Tran text="console" />,
      icon: <CmdIcon />,
      filter: { any: [{ authority: 'UPDATE_SERVER' }, { authorId: id }] },
    },
    { id: 'file', href: '/files', label: <Tran text="file" />, icon: <FileIcon />, filter: { any: [{ authority: 'UPDATE_SERVER' }, { authorId: id }] } },
    { id: 'setting', href: '/setting', label: <Tran text="setting" />, icon: <SettingIcon />, filter: { any: [{ authority: 'UPDATE_SERVER' }, { authorId: id }] } },
  ];
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
