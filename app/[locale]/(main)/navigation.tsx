import { ReactNode } from 'react';

import MediumScreenNavigationBar from '@/app/[locale]/(main)/medium-navigation-items';
import SmallScreenNavigationBar from '@/app/[locale]/(main)/small-navigation-items';

import { NavBarProvider } from '@/context/navbar-context';
import IsSmall from '@/layout/is-small';

export default function NavigationBar({ children }: { children: ReactNode }) {
  return (
    <NavBarProvider>
      <IsSmall
        small={
          <div className="grid h-full w-full grid-rows-[var(--nav)_1fr] overflow-hidden">
            <SmallScreenNavigationBar />
            <div className="relative h-full w-full overflow-hidden">{children}</div>
          </div>
        }
        notSmall={
          <div className="hidden h-full w-full grid-cols-[auto_1fr] justify-center sm:grid">
            <MediumScreenNavigationBar />
            <div className="relative h-full w-full overflow-hidden">{children}</div>
          </div>
        }
      />
    </NavBarProvider>
  );
}
