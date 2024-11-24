'use client';

import { ReactNode, useState } from 'react';
import React from 'react';

import NavLink from '@/app/[locale]/(user)/servers/[id]/nav-link';

import { GanttChartIcon, NotificationIcon, UsersIcon } from '@/components/common/icons';
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
    id: 'dashboard',
    href: '',
    label: <Tran text="manage" />,
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
    id: 'notification',
    href: 'notifications',
    label: <Tran text="notification" />,
    icon: <NotificationIcon />,
    filter: { authority: 'CREATE_NOTIFICATION' },
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
            <NavLink {...item} root="admin/users" hovered={hovered} setHovered={setHovered} />
          </ProtectedElement>
        ))}
      </div>
      <div className="h-full w-full overflow-hidden flex flex-col" key="child">
        {children}
      </div>
    </div>
  );
}
