'use client';

import { ReactNode, useCallback } from 'react';

import { NavItems } from '@/app/[locale]/navigation-items';
import { UserDisplay } from '@/app/[locale]/user-display';
import { Button } from '@/components/ui/button';
import env from '@/constant/env';
import { cn } from '@/lib/utils';

import { MenuIcon, NotificationIcon, UserIcon } from '@/components/common/icons';
import OutsideWrapper from '@/components/common/outside-wrapper';
import { motion } from 'framer-motion';
import { useMediaQuery } from 'usehooks-ts';
import { useNavBar } from '@/zustand/nav-bar-store';

const sidebarVariants = {
  open: {
    width: 'auto',
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
  closed: {
    width: 'var(--nav)',
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
};

type NavigationBarProps = {
  children: ReactNode;
};

export default function NavigationBar({ children }: NavigationBarProps) {
  const isSmall = useMediaQuery('(max-width: 640px)');

  if (isSmall) {
    return <SmallScreenNavigationBar>{children}</SmallScreenNavigationBar>;
  }

  return <SmallScreenNavigationBar>{children}</SmallScreenNavigationBar>;
}

function SmallScreenNavigationBar({ children }: NavigationBarProps) {
  const { isVisible, setVisible } = useNavBar();

  const showSidebar = useCallback(() => setVisible(true), [setVisible]);
  const hideSidebar = useCallback(() => setVisible(false), [setVisible]);

  return (
    <div className="grid h-full w-full grid-rows-[var(--nav)_1fr] overflow-hidden">
      <div className="flex h-nav w-full justify-between items-center bg-brand px-3 py-2 text-white shadow-lg">
        <Button title="Navbar" type="button" variant="link" size="icon" onFocus={showSidebar} onClick={showSidebar} onMouseEnter={showSidebar}>
          <MenuIcon />
        </Button>
        <div
          className={cn('pointer-events-none fixed inset-0 z-50 h-screen bg-transparent text-foreground', {
            'visible backdrop-blur-sm backdrop-brightness-50': isVisible,
          })}
        >
          <motion.div variants={sidebarVariants} animate={isVisible ? 'open' : 'closed'}>
            <div
              className={cn('pointer-events-auto fixed bottom-0 top-0 min-w-[280px] translate-x-[-100%] justify-between overflow-hidden bg-background duration-300', {
                'translate-x-0': isVisible,
              })}
            >
              <div
                className="h-full w-full overflow-hidden"
                onMouseLeave={hideSidebar} //
                onMouseEnter={showSidebar}
              >
                <OutsideWrapper className="h-full w-full overflow-hidden" onClickOutside={hideSidebar}>
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
      <div className="relative h-full w-full overflow-hidden">{children}</div>
    </div>
  );
}

function BigScreenNavigationBar({ children }: NavigationBarProps) {
  const { isVisible, setVisible } = useNavBar();

  const isSmall = useMediaQuery('(max-width: 640px)');

  const expand = isSmall ? true : isVisible;

  const showSidebar = useCallback(() => setVisible(false), [setVisible]);
  const hideSidebar = useCallback(() => setVisible(false), [setVisible]);

  return (
    <div className="grid h-full w-full grid-cols-[auto_1fr] justify-center overflow-hidden">
      <motion.div className="flex flex-col" variants={sidebarVariants} animate={isVisible ? 'open' : 'closed'}>
        <div
          className="h-full w-full overflow-hidden p-3"
          onMouseLeave={hideSidebar} //
          onMouseEnter={showSidebar}
        >
          <Button className='w-full' title="Navbar" type="button" variant="link" size="icon" onFocus={showSidebar} onClick={showSidebar} onMouseEnter={showSidebar}>
            <MenuIcon />
          </Button>
          <OutsideWrapper className="h-full w-full overflow-hidden" onClickOutside={hideSidebar}>
            <div className="flex h-full flex-col justify-between overflow-hidden">
              <div className="flex h-full flex-col items-center overflow-hidden">
                <span className="flex flex-col gap-2">
                  <span className="space-x-2 rounded-sm">
                    <div className={cn('hidden', { visible: expand })}>
                      <h1 className="text-xl font-medium">MindustryTool</h1>
                      <span className="text-xs">{env.webVersion}</span>
                    </div>
                  </span>
                </span>
                <NavItems onClick={hideSidebar} />
              </div>
              <UserDisplay />
            </div>
          </OutsideWrapper>
        </div>
      </motion.div>
      <div className="relative h-full w-full overflow-hidden">{children}</div>
    </div>
  );
}
