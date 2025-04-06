import { ReactNode } from 'react';

import MediumScreenNavigationBar from '@/app/[locale]/(main)/medium-navigation-items';
import SmallScreenNavigationBar from '@/app/[locale]/(main)/small-navigation-items';

import { NavBarProvider } from '@/context/navbar-context';
import IsSmall from '@/layout/is-small';

export default function NavigationBar({ children }: { children: ReactNode }) {
  return (
    <NavBarProvider>
      <div className="grid h-full w-full grid-rows-[var(--nav)_1fr] overflow-hidden z-50 sm:grid-cols-[auto_1fr] sm:justify-center sm:grid-rows-1">
        <div className="flex h-nav w-full items-center justify-between bg-brand px-2 py-2 shadow-lg sm:hidden">
          <IsSmall small={<SmallScreenNavigationBar />} />
        </div>
        <div className="flex-col h-full hidden sm:flex">
          <IsSmall notSmall={
            <MediumScreenNavigationBar />
          }/>
        </div>
        <div className="relative h-full w-full overflow-hidden">{children}</div>
      </div>
    </NavBarProvider>
  );
}
