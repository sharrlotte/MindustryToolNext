import React, { ReactNode } from 'react';

import { getCachedServer } from '@/app/[locale]/(user)/servers/[id]/(dashboard)/page';

import ErrorScreen from '@/components/common/error-screen';
import { CmdIcon, FileIcon, LayoutDashboardIcon, LogIcon, MapIcon, PluginIcon, SettingIcon } from '@/components/common/icons';
import NavLink from '@/components/common/nav-link';
import NavLinkContainer from '@/components/common/nav-link-container';
import Tran from '@/components/common/tran';

import { getSession } from '@/action/action';
import { NavLinkProvider } from '@/context/nav-link-context';
import ProtectedElement from '@/layout/protected-element';
import { Filter, isError } from '@/lib/utils';

type LayoutProps = {
  params: Promise<{
    id: string;
  }>;
  children: ReactNode;
};

export default async function ServerLayout({ params, children }: LayoutProps) {
  const { id } = await params;
  const session = await getSession();
  const server = await getCachedServer(id);

  if (isError(session)) {
    return <ErrorScreen error={session} />;
  }

  if (isError(server)) {
    return <ErrorScreen error={server} />;
  }

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
    {
      id: 'map', //
      href: '/maps',
      label: <Tran text="map" />,
      icon: <MapIcon />,
      filter: { any: [{ authority: 'UPDATE_SERVER' }, { authorId: server.userId }] },
    },
    {
      id: 'plugin',
      href: '/plugins',
      label: <Tran text="plugin" />,
      icon: <PluginIcon />,
      filter: { any: [{ authority: 'UPDATE_SERVER' }, { authorId: server.userId }] },
    },
    {
      id: 'console',
      href: '/console',
      label: <Tran text="console" />,
      icon: <CmdIcon />,
      filter: { any: [{ authority: 'UPDATE_SERVER' }, { authorId: server.userId }] },
    },
    {
      id: 'log',
      href: '/logs',
      label: <Tran text="logs" />,
      icon: <LogIcon />,
      filter: { any: [{ authority: 'UPDATE_SERVER' }, { authorId: server.userId }] },
    },
    {
      id: 'file', //
      href: '/files',
      label: <Tran text="file" />,
      icon: <FileIcon />,
      filter: { any: [{ authority: 'UPDATE_SERVER' }, { authorId: server.userId }] },
    },
    {
      id: 'setting', //
      href: '/setting',
      label: <Tran text="setting" />,
      icon: <SettingIcon />,
      filter: { any: [{ authority: 'UPDATE_SERVER' }, { authorId: server.userId }] },
    },
  ];

  return (
    <div className="grid h-full grid-flow-row grid-rows-[auto,1fr] gap-2 overflow-hidden p-2">
      <NavLinkProvider>
        <NavLinkContainer>
          {links.map((item) => (
            <ProtectedElement key={item.id} session={session} filter={item.filter ?? true}>
              <NavLink {...item} root={`servers/${id}`} />
            </ProtectedElement>
          ))}
        </NavLinkContainer>
      </NavLinkProvider>
      <div className="h-full w-full overflow-hidden flex flex-col" key="child">
        {children}
      </div>
    </div>
  );
}
