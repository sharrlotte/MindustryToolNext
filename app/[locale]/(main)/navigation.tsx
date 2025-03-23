import { ReactNode } from 'react';

import MediumScreenNavigationBar from '@/app/[locale]/(main)/medium-navigation-items';
import SmallScreenNavigationBar from '@/app/[locale]/(main)/small-navigation-items';

import { NavBarProvider } from '@/context/navbar-context';

export default function NavigationBar({ children }: { children: ReactNode }) {
  return (
    <NavBarProvider>
      <div className="grid h-full w-full grid-rows-[var(--nav)_1fr] overflow-hidden z-50 sm:grid-cols-[auto_1fr] sm:justify-center sm:grid-rows-1">
        <SmallScreenNavigationBar />
        <MediumScreenNavigationBar />
        <div className="relative h-full w-full overflow-hidden">{children}</div>
      </div>
    </NavBarProvider>
  );
}
