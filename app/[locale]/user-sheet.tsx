'use client';

import { GlobeIcon, HomeIcon, UserIcon } from 'lucide-react';
import Link from 'next/link';
import React, { ReactNode } from 'react';

import ComboBox from '@/components/common/combo-box';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';
import Divider from '@/components/ui/divider';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
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
    ],
    [
      {
        icon: <Cog6ToothIcon className="h-5 w-5" />,
        action: (
          <Link className="w-full" href="/users/me/setting">
            {t('setting')}
          </Link>
        ),
      },
      {
        icon: <GlobeIcon className="h-5 w-5" />,
        action: (
          <Dialog>
            <DialogTrigger className="w-full text-start">
              Change language
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>Choose your language</DialogHeader>
              <ComboBox<Locale>
                value={{ label: locale, value: locale }}
                values={locales.map((value: Locale) => ({
                  label: value,
                  value,
                }))}
                onChange={(value) => changeLocale(value ?? 'en')}
              />
              <DialogFooter>
                You can contribute to website language at
                <a href="https://github.com/sharrlotte/MindustryToolNext/issues">
                  {' Github'}
                </a>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ),
      },
    ],
    [
      {
        icon: <ArrowLeftEndOnRectangleIcon className="h-5 w-5" />,
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
        <SheetContent className="space-y-2 p-2">
          <div className="flex items-end gap-2">
            <UserAvatar
              className="h-8 w-8"
              user={session}
              url="/users/me"
              clickable={false}
            />
            <span>{session.name}</span>
          </div>
          <div className="pt-6 divide-2">
            {tabs.map((tab, index) => (
              <React.Fragment key={index}>
                {tab.map(({ action, icon }, index) => (
                  <div
                    className="flex gap-2 rounded-md p-2 hover:bg-button hover:text-white items-center"
                    key={index}
                  >
                    {icon}
                    {action}
                  </div>
                ))}
              </React.Fragment>
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
