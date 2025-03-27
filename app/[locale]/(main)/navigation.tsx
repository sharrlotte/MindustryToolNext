'use client';

import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

import { NavBarProvider } from '@/context/navbar-context';
import IsSmall from '@/layout/is-small';

const SmallScreenNavigationBar = dynamic(() => import('@/app/[locale]/(main)/small-navigation-items'), { ssr: false, loading: () => <div className="h-nav min-h-nav bg-brand" /> });
const MediumScreenNavigationBar = dynamic(() => import('@/app/[locale]/(main)/medium-navigation-items'), { ssr: false, loading: () => <div className="w-nav" /> });

export default function NavigationBar({ children }: { children: ReactNode }) {
  return (
    <NavBarProvider>
      <div className="grid h-full w-full grid-rows-[var(--nav)_1fr] overflow-hidden z-50 sm:grid-cols-[auto_1fr] sm:justify-center sm:grid-rows-1">
        <IsSmall
          small={
            <div className="flex h-nav w-full items-center justify-between bg-brand px-2 py-2 shadow-lg sm:hidden">
              <SmallScreenNavigationBar />
            </div>
          }
          notSmall={
              <MediumScreenNavigationBar />
          }
        />
        <div className="relative h-full w-full overflow-hidden">{children}</div>
      </div>
    </NavBarProvider>
  );
}
