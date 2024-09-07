'use client';

import { GlobeIcon } from 'lucide-react';
import Link from 'next/link';
import React, { ReactNode, useMemo } from 'react';

import ComboBox from '@/components/common/combo-box';
import { ThemeSwitcher } from '@/components/theme/theme-switcher';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Locale,
  locales,
  useChangeLocale,
  useCurrentLocale,
  useI18n,
} from '@/locales/client';

import { Cog6ToothIcon } from '@heroicons/react/24/outline';

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
            <Link className="w-full" href="/users/@me/setting">
              {t('setting')}
            </Link>
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
  const changeLocale = useChangeLocale({ preserveSearchParams: true });
  const locale = useCurrentLocale();

  return (
    <Dialog>
      <DialogTrigger className="w-full text-start">
        Change language
      </DialogTrigger>
      <DialogContent className="p-6">
        <DialogHeader>
          <DialogTitle>Choose your language</DialogTitle>
        </DialogHeader>
        <ComboBox<Locale>
          value={{ label: locale, value: locale }}
          values={locales.map((value: Locale) => ({
            label: value,
            value,
          }))}
          searchBar={false}
          onChange={(value) => changeLocale(value ?? 'en')}
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
