'use client';

import React, { ReactNode, useCallback } from 'react';

import OutsideWrapper from '@/components/common/outside-wrapper';

import { useNavBar } from '@/context/navbar-context';
import { cn } from '@/lib/utils';

type Props = {
  children: ReactNode;
};
export default function SmallNavbarCollapse({ children }: Props) {
  const { visible, setVisible } = useNavBar();

  const hideSidebar = useCallback(() => setVisible(false), [setVisible]);
  const showSidebar = useCallback(() => setVisible(true), [setVisible]);

  return (
    <div
      className={cn('pointer-events-none fixed inset-0 z-50 h-screen bg-transparent text-foreground', {
        'backdrop-blur-sm backdrop-brightness-50': visible,
      })}
    >
      <div>
        <div
          className={cn('pointer-events-auto fixed bottom-0 top-0 min-w-[280px] translate-x-[-100%] justify-between overflow-hidden bg-background dark:bg-background/90 transition-transform', {
            'translate-x-0': visible,
          })}
        >
          <div
            className="h-full w-full overflow-hidden"
            onMouseLeave={hideSidebar} //
            onMouseEnter={showSidebar}
          >
            <OutsideWrapper className="h-full w-full overflow-hidden" onClickOutside={hideSidebar}>
              {children}
            </OutsideWrapper>
          </div>
        </div>
      </div>
    </div>
  );
}
