'use client';

import { GlobeIcon, HomeIcon, InfoIcon, UserIcon } from 'lucide-react';
import Link from 'next/link';
import React, { ReactNode } from 'react';

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
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import ColorAsRole from '@/components/user/color-as-role';
import UserAvatar from '@/components/user/user-avatar';
import env from '@/constant/env';
import { useSession } from '@/context/session-context';
import {
  Locale,
  locales,
  useChangeLocale,
  useCurrentLocale,
  useI18n,
} from '@/locales/client';

import {
  ArrowLeftEndOnRectangleIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

type Tab = {
  icon: ReactNode;
  action: ReactNode;
}[][];

export function UserSheet() {
  const { session } = useSession();
  const t = useI18n();

  const changeLocale = useChangeLocale({ preserveSearchParams: true });
  const locale = useCurrentLocale();

  const tabs: Tab = [
    [
      {
        icon: <HomeIcon className="h-5 w-5" />,
        action: (
          <Link className="w-full" href="/">
            {t('home')}
          </Link>
        ),
      },
    ],
    [
      {
        icon: <UserIcon className="h-5 w-5" />,
        action: (
          <Link className="w-full" href="/users/me">
            {t('user')}
          </Link>
        ),
      },
      {
        icon: <InfoIcon className="h-5 w-5" />,
        action: (
          <Link className="w-full" href="/users/me">
            Info
          </Link>
        ),
      },
    ],
    [
      {
        icon: <GlobeIcon className="h-5 w-5" />,
        action: (
          <Dialog>
            <DialogTrigger className="w-full text-start">
              Change language
            </DialogTrigger>
            <DialogContent>
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
                  You can contribute to website language at Github
                </a>
              </DialogDescription>
            </DialogContent>
          </Dialog>
        ),
      },
      {
        icon: undefined,
        action: <ThemeSwitcher />,
      },
      {
        icon: <Cog6ToothIcon className="h-6 w-6" />,
        action: (
          <Link className="w-full" href="/users/me/setting">
            {t('setting')}
          </Link>
        ),
      },
    ],
    [
      {
        icon: <ArrowLeftEndOnRectangleIcon className="h-6 w-7" />,
        action: (
          <a className="w-full" href={`${env.url.api}/auth/logout`}>
            {t('logout')}
          </a>
        ),
      },
    ],
  ];

  if (session) {
    return (
      <Sheet>
        <SheetTrigger className="cursor-pointer">
          <UserAvatar
            className="h-8 w-8"
            user={session}
            url="/users/me"
            clickable={false}
          />
        </SheetTrigger>
        <SheetContent className="space-y-2 p-2 md:min-w-[20vw] text-sm">
          <div className="flex items-end gap-2">
            <UserAvatar
              className="h-12 w-12"
              user={session}
              url="/users/me"
              clickable={false}
            />
            <ColorAsRole
              className="capitalize font-bold text-xl"
              roles={session.roles}
            >
              {session.name}
            </ColorAsRole>
          </div>
          <div className="divide-y-2 space-y-4 text-opacity-90">
            {tabs.map((tab, index) => (
              <div key={index} className="pt-4">
                {tab.map(({ action, icon }, index) => (
                  <div
                    className="grid grid-cols-[20px,1fr] w-full gap-4 rounded-sm p-2 hover:bg-button hover:text-white items-center cursor-pointer min-w-52"
                    key={index}
                  >
                    {icon}
                    {action}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <a className="font-bold px-2" href={`${env.url.api}/oauth2/discord`}>
      {t('login')}
    </a>
  );
}
