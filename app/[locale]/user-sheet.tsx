'use client';

import { GlobeIcon } from 'lucide-react';
import React, { ReactNode, useMemo } from 'react';

import ComboBox from '@/components/common/combo-box';
import { ThemeSwitcher } from '@/components/theme/theme-switcher';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useChangeLocale, useI18n } from '@/i18n/client';

import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import { useLocaleStore } from '@/zustand/locale-store';
import { Locale, locales } from '@/i18n/config';
import Tran from '@/components/common/tran';
import InternalLink from '@/components/common/internal-link';

type Tab = {
  icon: ReactNode;
  action: ReactNode;
}[][];

export function UserActions() {
  const t = useI18n();

  const tabs: Tab = useMemo(
    () => [
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
          icon: <Cog6ToothIcon className="h-6 w-6" />,
          action: (
            <InternalLink className="w-full" href="/users/@me/setting">
              {t('setting')}
            </InternalLink>
          ),
        },
      ],
    ],
    [t],
  );

  return (
    <div className="space-y-4 divide-y-2 text-opacity-90">
      {tabs.map((tab, index) => (
        <div key={index}>
          {tab.map(({ action, icon }, index) => (
            <div
              className="grid w-full min-w-52 cursor-pointer grid-cols-[20px,1fr] items-center gap-4 rounded-sm p-2 hover:bg-brand hover:text-white"
              key={index}
            >
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
