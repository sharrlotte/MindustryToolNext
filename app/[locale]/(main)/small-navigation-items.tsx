import React from 'react';

import { MediumNavItems } from '@/app/[locale]/(main)/medium-navigation-items';
import NavHeader from '@/app/[locale]/(main)/small-nav-header';
import SmallNavbarCollapse from '@/app/[locale]/(main)/small-navbar-collapse';
import SmallNavbarInsideToggle from '@/app/[locale]/(main)/small-navbar-inside-toggle';
import { UserDisplay } from '@/app/[locale]/(main)/user-display';
import HorizontalNavbarUserAvatar from '@/app/horizontal-navbar-user-avatar';
import SmallNavbarToggle from '@/app/small-navbar-toggle';

import Hydrated from '@/components/common/hydrated';
import Divider from '@/components/ui/divider';

export default function SmallScreenNavigationBar() {
  return (
    <>
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
            <MediumNavItems />
          </div>
          <Divider />
          <Hydrated>
            <UserDisplay />
          </Hydrated>
        </div>
      </SmallNavbarCollapse>
      <HorizontalNavbarUserAvatar />
    </>
  );
}
