'use client';

import { GlobeIcon } from 'lucide-react';
import React, { ReactNode } from 'react';

import ComboBox from '@/components/common/combo-box';
import { ThemeSwitcher } from '@/components/theme/theme-switcher';
import { Dialog, DialogContent, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { useChangeLocale, useI18n } from '@/i18n/client';

import { useLocaleStore } from '@/zustand/locale-store';
import { Locale, locales } from '@/i18n/config';
import Tran from '@/components/common/tran';
import InternalLink from '@/components/common/internal-link';
import { SettingIcon } from '@/components/common/icons';

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

function ChangeLanguageDialog() {
  const { currentLocale } = useLocaleStore();
  const setCurrentLocale = useChangeLocale();
  const t = useI18n();

  function onLanguageChange(value: any) {
    setCurrentLocale(value ?? 'en');
  }

  return (
    <Dialog>
      <DialogTrigger className="w-full text-start">
        <Tran text="switch-language" />
      </DialogTrigger>
      <DialogContent className="p-6">
        <ComboBox<Locale>
          value={{ label: t(currentLocale), value: currentLocale }}
          values={locales.map((value: Locale) => ({
            label: t(value),
            value,
          }))}
          searchBar={false}
          onChange={onLanguageChange}
        />
        <DialogDescription>
          <a href="https://github.com/sharrlotte/MindustryToolNext/issues">
            You can contribute to website language at
            <span className="text-brand"> Github</span>
          </a>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
