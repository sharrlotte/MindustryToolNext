import { GlobeIcon } from 'lucide-react';
import React, { ReactNode } from 'react';

import { ChangeLanguageDialog } from '@/app/[locale]/change-language-dialog';
import { SettingIcon } from '@/components/common/icons';
import InternalLink from '@/components/common/internal-link';
import Tran from '@/components/common/tran';
import { ThemeSwitcher } from '@/components/theme/theme-switcher';

type Tab = {
  icon: ReactNode;
  action: ReactNode;
}[][];

const tabs: Tab = [
  [
    {
      icon: <GlobeIcon className="size-5" />,
      action: <ChangeLanguageDialog />,
    },
    {
      icon: undefined,
      action: <ThemeSwitcher />,
    },
    {
      icon: <SettingIcon />,
      action: (
        <InternalLink className="w-full" href="/users/@me/setting">
          <Tran text="setting" />
        </InternalLink>
      ),
    },
  ],
];

export function UserActions() {
  return (
    <div className="space-y-4 divide-y-2 text-opacity-90">
      {tabs.map((tab, index) => (
        <div className="space-y-1" key={index}>
          {tab.map(({ action, icon }, index) => (
            <div className="grid w-full min-w-52 cursor-pointer grid-cols-[20px,1fr] items-center gap-2 rounded-sm px-1 py-2 hover:bg-brand hover:text-white" key={index}>
              {icon}
              {action}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
