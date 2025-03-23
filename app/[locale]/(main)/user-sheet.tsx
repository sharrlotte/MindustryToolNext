'use client';

import Link from 'next/link';
import React, { ReactNode } from 'react';

import { ChangeLanguageDialog } from '@/app/[locale]/(main)/change-language-dialog';
import NotificationDialog from '@/app/[locale]/(main)/notification-dialog';

import Hydrated from '@/components/common/hydrated';
import { GlobIcon, SettingIcon } from '@/components/common/icons';
import Tran from '@/components/common/tran';
import { ThemeSwitcher } from '@/components/theme/theme-switcher';

import { useSession } from '@/context/session-context';
import ProtectedElement from '@/layout/protected-element';
import { Filter } from '@/lib/utils';

type Tab = {
  icon: ReactNode;
  action: ReactNode;
  filter?: Filter;
}[];

const tabs: Tab = [
  {
    icon: undefined,
    action: <ThemeSwitcher />,
  },
  {
    icon: <GlobIcon />,
    action: (
      <Hydrated>
        <ChangeLanguageDialog />
      </Hydrated>
    ),
  },
  {
    icon: undefined,
    action: <NotificationDialog />,
    filter: true,
  },
  {
    icon: <SettingIcon />,
    action: (
      <Link className="w-full" href="/users/@me/setting">
        <Tran text="setting" />
      </Link>
    ),
    filter: true,
  },
];

export function UserActions() {
  const { session } = useSession();

  return tabs.map(({ action, icon, filter }, index) => (
    <ProtectedElement session={session} filter={filter} key={index}>
      <div className="grid w-full min-w-52 cursor-pointer grid-cols-[20px,1fr] items-center gap-2 rounded-sm px-1 py-2 hover:bg-brand hover:text-white" key={index}>
        {icon}
        {action}
      </div>
    </ProtectedElement>
  ));
}
