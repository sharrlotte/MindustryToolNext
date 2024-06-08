'use client';

import { useState } from 'react';
import React from 'react';

import { NavItems } from '@/app/[locale]/navigation-items';
import { SideBar } from '@/app/[locale]/sidebar';
import { UserDisplay } from '@/app/[locale]/user-display';
import LoadingSpinner from '@/components/common/loading-spinner';
import OutsideWrapper from '@/components/common/outside-wrapper';
import { ThemeSwitcher } from '@/components/theme/theme-switcher';
import { Button } from '@/components/ui/button';
import env from '@/constant/env';
import { cn } from '@/lib/utils';
import { useLoadingState } from '@/zustand/loading-state';

import { Bars3Icon, BellIcon } from '@heroicons/react/24/outline';

export default function NavigationBar() {
  const [isSidebarVisible, setSidebarVisibility] = useState(false);

  const showSidebar = () => setSidebarVisibility(true);

  const hideSidebar = () => setSidebarVisibility(false);

  const isLoading = useLoadingState((state) => state.isLoading);

  return (
    <>
      {isLoading && (
        <LoadingSpinner className="fixed inset-0 flex justify-center items-center z-50 backdrop-blur-sm backdrop-brightness-50" />
      )}
      <div className="flex h-nav w-full items-center justify-between bg-button p-1 text-white shadow-lg">
        <Button
          title="Navbar"
          type="button"
          variant="link"
          size="icon"
          onFocus={showSidebar}
          onClick={showSidebar}
          onMouseEnter={showSidebar}
        >
          <Bars3Icon className="h-8 w-8 text-white" />
        </Button>
        <div
          className={cn(
            'pointer-events-none fixed inset-0 z-50 h-screen bg-transparent text-foreground',
            {
              'visible backdrop-blur-sm': isSidebarVisible,
            },
          )}
        >
          <OutsideWrapper
            className={cn(
              'pointer-events-auto fixed bottom-0 top-0 flex min-w-[250px] translate-x-[-100%] flex-col justify-between overflow-hidden bg-background transition-transform duration-300',
              {
                'translate-x-0': isSidebarVisible,
              },
            )}
            onClickOutside={hideSidebar}
          >
            <div
              className="flex h-full flex-col overflow-hidden"
              onMouseLeave={hideSidebar} //
              onMouseEnter={showSidebar}
            >
              <div className="flex h-full flex-col justify-between overflow-hidden p-2">
                <div className="flex h-full flex-1 flex-col overflow-hidden">
                  <span className="flex flex-col gap-2">
                    <span className="flex items-center justify-start gap-2 rounded-sm bg-card p-2">
                      <span className="text-xl font-medium">MindustryTool</span>
                    </span>
                    <span className="rounded-sm bg-card p-2 text-xs">
                      {env.webVersion}
                    </span>
                  </span>
                  <NavItems onClick={hideSidebar} />
                </div>
                <UserDisplay />
              </div>
            </div>
          </OutsideWrapper>
        </div>
        <div className="flex items-center justify-center">
          <Button className="aspect-square p-0" title="setting" variant="icon">
            <BellIcon className="h-5 w-5" />
          </Button>
          <ThemeSwitcher className="flex aspect-square h-full" />
          <SideBar />
        </div>
      </div>
    </>
  );
}
