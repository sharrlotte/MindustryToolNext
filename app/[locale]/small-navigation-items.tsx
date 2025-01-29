import React from 'react';

import { MediumNavItems } from '@/app/[locale]/medium-navigation-items';
import SmallNavbarCollapse from '@/app/[locale]/small-navbar-collapse';
import SmallNavbarInsideToggle from '@/app/[locale]/small-navbar-inside-toggle';
import { UserDisplay } from '@/app/[locale]/user-display';
import HorizontalNavbarUserAvatar from '@/app/horizontal-navbar-user-avatar';
import { PathGroup } from '@/app/routes';
import SmallNavbarToggle from '@/app/small-navbar-toggle';

import Divider from '@/components/ui/divider';

import env from '@/constant/env';

type NavigationBarProps = {
  pathGroups: PathGroup[];
};

export default function SmallScreenNavigationBar({ pathGroups }: NavigationBarProps) {
  return (
    <div className="flex h-nav w-full items-center justify-between bg-brand px-2 py-2 shadow-lg">
      <SmallNavbarToggle />
      <SmallNavbarCollapse>
        <div className="flex h-full flex-col justify-between overflow-hidden p-2">
          <div className="flex h-full flex-col overflow-hidden">
            <span className="flex flex-col gap-2">
              <span className="flex justify-between items-start rounded-sm p-2">
                <NavHeader />
                <SmallNavbarInsideToggle />
              </span>
            </span>
            <MediumNavItems pathGroups={pathGroups} />
          </div>
          <Divider />
          <UserDisplay />
        </div>
      </SmallNavbarCollapse>
      <HorizontalNavbarUserAvatar />
    </div>
  );
}

function NavHeader() {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-xl font-medium">MindustryTool</h1>
      <span className="text-xs">{env.webVersion}</span>
    </div>
  );
}
