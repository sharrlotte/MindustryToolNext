'use client';

import { useCallback, useState } from 'react';

import { NavItems } from '@/app/[locale]/navigation-items';
import { UserDisplay } from '@/app/[locale]/user-display';
import { Button } from '@/components/ui/button';
import env from '@/constant/env';
import { cn } from '@/lib/utils';

import {
  MenuIcon,
  NotificationIcon,
  UserIcon,
} from '@/components/common/icons';
import OutsideWrapper from '@/components/common/outside-wrapper';
import { motion } from 'framer-motion';
import { useMediaQuery } from 'usehooks-ts';

const sidebarVariants = {
  open: {
    width: 'auto',
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
  closed: {
    width: 0,
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
};

export default function NavigationBar() {
  const isSmall = useMediaQuery('(min-width: 640px)');

  return isSmall ? <SmallScreenNavigationBar /> : <SmallScreenNavigationBar />;
}

function SmallScreenNavigationBar() {
  const [isSidebarVisible, setSidebarVisibility] = useState(false);

  const showSidebar = useCallback(
    () => setSidebarVisibility(true),
    [setSidebarVisibility],
  );
  const hideSidebar = useCallback(
    () => setSidebarVisibility(false),
    [setSidebarVisibility],
  );

  return (
    <div className="flex h-nav w-full items-center justify-between px-3 py-2 text-white bg-brand shadow-lg">
      <Button
        title="Navbar"
        type="button"
        variant="link"
        size="icon"
        onFocus={showSidebar}
        onClick={showSidebar}
        onMouseEnter={showSidebar}
      >
        <MenuIcon />
      </Button>
      <div
        className={cn(
          'pointer-events-none fixed inset-0 z-50 h-screen bg-transparent text-foreground',
          {
            'visible backdrop-blur-sm backdrop-brightness-50': isSidebarVisible,
          },
        )}
      >
        <motion.div
          variants={sidebarVariants}
          animate={isSidebarVisible ? 'open' : 'closed'}
        >
          <div
            className={cn(
              'pointer-events-auto fixed bottom-0 top-0 min-w-[280px] translate-x-[-100%] justify-between overflow-hidden bg-background duration-300',
              {
                'translate-x-0': isSidebarVisible,
              },
            )}
          >
            <div
              className="h-full w-full overflow-hidden"
              onMouseLeave={hideSidebar} //
              onMouseEnter={showSidebar}
            >
              <OutsideWrapper
                className="h-full w-full overflow-hidden"
                onClickOutside={hideSidebar}
              >
                <div className="flex h-full flex-col justify-between overflow-hidden p-2">
                  <div className="flex h-full flex-col overflow-hidden">
                    <span className="flex flex-col gap-2">
                      <span className="space-x-2 rounded-sm p-2">
                        <h1 className="text-xl font-medium">MindustryTool</h1>
                        <span className="text-xs">{env.webVersion}</span>
                      </span>
                    </span>
                    <NavItems onClick={hideSidebar} />
                  </div>
                  <UserDisplay />
                </div>
              </OutsideWrapper>
            </div>
          </div>
        </motion.div>
      </div>
      <div className="flex gap-2">
        <UserIcon />
        <NotificationIcon />
      </div>
    </div>
  );
}
