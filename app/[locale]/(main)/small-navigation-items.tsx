import React from 'react';

import { MediumNavItems } from '@/app/[locale]/(main)/medium-navigation-items';
import SmallNavbarCollapse from '@/app/[locale]/(main)/small-navbar-collapse';
import SmallNavbarInsideToggle from '@/app/[locale]/(main)/small-navbar-inside-toggle';
import { UserDisplay } from '@/app/[locale]/(main)/user-display';
import HorizontalNavbarUserAvatar from '@/app/horizontal-navbar-user-avatar';
import SmallNavbarToggle from '@/app/small-navbar-toggle';

import { MindustryToolIcon } from '@/components/common/icons';
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
              <span className="flex justify-between items-start rounded-sm p-1">
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
    <h1 className="text-xl font-medium flex gap-2 items-center p-0">
      <MindustryToolIcon className="size-9" height={36} width={36} />
      <div className="flex flex-col">
        <span>MindustryTool</span>
        <span className="overflow-hidden whitespace-nowrap text-xs">{env.webVersion}</span>
      </div>
    </h1>
  );
}
