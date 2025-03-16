import React from 'react';

import { MediumNavItems } from '@/app/[locale]/(main)/medium-navigation-items';
import SmallNavbarCollapse from '@/app/[locale]/(main)/small-navbar-collapse';
import SmallNavbarInsideToggle from '@/app/[locale]/(main)/small-navbar-inside-toggle';
import { UserDisplay } from '@/app/[locale]/(main)/user-display';
import HorizontalNavbarUserAvatar from '@/app/horizontal-navbar-user-avatar';
import SmallNavbarToggle from '@/app/small-navbar-toggle';

import Divider from '@/components/ui/divider';

import env from '@/constant/env';
import useRoutes from '@/hooks/use-routes';

export default function SmallScreenNavigationBar() {
  const pathGroups = useRoutes();

  return (
    <nav className="flex h-nav w-full items-center justify-between bg-brand px-2 py-2 shadow-lg">
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
    </nav>
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
