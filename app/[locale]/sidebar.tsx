import LoginButton from '@/components/button/login-button';
import LogoutButton from '@/components/button/logout-button';
import ComboBox from '@/components/common/combo-box';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import UserAvatar from '@/components/user/user-avatar';
import { useSession } from '@/context/session-context';
import {
  Locale,
  locales,
  useChangeLocale,
  useCurrentLocale,
} from '@/locales/client';

import {
  ArrowLeftEndOnRectangleIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import { GlobeIcon, HomeIcon, UserIcon } from 'lucide-react';
import Link from 'next/link';
import React, { ReactNode } from 'react';

type Tab = {
  icon: ReactNode;
  action: ReactNode;
}[][];

export function SideBar() {
  const { session } = useSession();

  const changeLocale = useChangeLocale({ preserveSearchParams: true });
  const locale = useCurrentLocale();

  const tabs: Tab = [
    [
      {
        icon: <HomeIcon className="h-5 w-5" />,
        action: (
          <Link className="w-full" href="/">
            Trang chủ
          </Link>
        ),
      },
    ],
    [
      {
        icon: <UserIcon className="h-5 w-5" />,
        action: (
          <Link className="w-full" href="/users/me">
            Thông tin tài khoản
          </Link>
        ),
      },
    ],
    [
      {
        icon: <Cog6ToothIcon className="h-5 w-5" />,
        action: 'Cài đặt',
      },
      {
        icon: <GlobeIcon className="h-5 w-5" />,
        action: (
          <ComboBox<Locale>
            value={{ label: locale, value: locale }}
            values={locales.map((value: Locale) => ({ label: value, value }))}
            onChange={(value) => changeLocale(value ?? 'en')}
          />
        ),
      },
    ],
    [
      {
        icon: <ArrowLeftEndOnRectangleIcon className="h-5 w-5" />,
        action: <LogoutButton />,
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
          <div className="pt-6">
            {tabs.map((tab, index) => (
              <React.Fragment key={index}>
                {tab.map(({ action, icon }, index) => (
                  <div
                    className="flex gap-2 rounded-md p-2 hover:bg-blue-500 hover:text-white"
                    key={index}
                  >
                    {icon}
                    {action}
                  </div>
                ))}
                <div className="mb-1 w-full border-b pt-1" />
              </React.Fragment>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return <LoginButton />;
}
