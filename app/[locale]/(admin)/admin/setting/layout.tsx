'use client';

import { ReactNode, useState } from 'react';
import React from 'react';

import { GanttChartIcon, ModIcon, NotificationIcon, SettingIcon, TagIcon, UsersIcon } from '@/components/common/icons';
import NavLink from '@/components/common/nav-link';
import Tran from '@/components/common/tran';

import { useSession } from '@/context/session-context.client';
import ProtectedElement from '@/layout/protected-element';
import { Filter } from '@/lib/utils';

const links: {
  id: string;
  href: string;
  label: ReactNode;
  icon: ReactNode;
  filter?: Filter;
}[] = [
  {
    id: 'users',
    href: '',
    label: <Tran text="user" />,
    icon: <GanttChartIcon />,
    filter: { authority: 'EDIT_USER_AUTHORITY' },
  },
  {
    id: 'role',
    href: 'roles',
    label: <Tran text="role" />,
    icon: <UsersIcon />,
    filter: { authority: 'EDIT_ROLE_AUTHORITY' },
  },
  {
    id: 'tag',
    href: 'tags',
    label: <Tran text="tag" />,
    icon: <TagIcon />,
    filter: { authority: 'MANAGE_TAG' },
  },
  {
    id: 'mod',
    href: 'mods',
    label: <Tran text="mod" />,
    icon: <ModIcon />,
    filter: { authority: 'MANAGE_TAG' },
  },
  {
    id: 'notification',
    href: 'notifications',
    label: <Tran text="notification" />,
    icon: <NotificationIcon />,
    filter: { authority: 'CREATE_NOTIFICATION' },
  },
  {
    id: 'config',
    label: <Tran text="setting" />,
    href: 'config',
    icon: <SettingIcon />,
    filter: { authority: 'VIEW_SETTING' },
  },
];

type LayoutProps = {
  children: ReactNode;
};

export default function ServerLayout({ children }: LayoutProps) {
  const { session } = useSession();
  const [hovered, setHovered] = useState<string>('Yes this is empty');

  return (
    <div className="grid h-full grid-flow-row grid-rows-[auto,1fr] gap-2 overflow-hidden p-2">
      <div className="no-scrollbar flex h-full gap-3 overflow-x-auto bg-card px-2" onMouseLeave={() => setHovered('Yes this is empty')} onTouchCancel={() => setHovered('Yes this is empty')}>
        {links.map((item) => (
          <ProtectedElement key={item.id} session={session} filter={item.filter ?? true}>
            <NavLink {...item} root="admin/setting" hovered={hovered} setHovered={setHovered} />
          </ProtectedElement>
        ))}
      </div>
      <div className="h-full w-full overflow-hidden flex flex-col" key="child">
        {children}
      </div>
    </div>
  );
}
