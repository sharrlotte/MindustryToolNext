import { ReactNode } from 'react';

import MediumScreenNavigationBar from '@/app/[locale]/medium-navigation-items';
import SmallScreenNavigationBar from '@/app/[locale]/small-navigation-items';
import { groups } from '@/app/routes';

import ErrorScreen from '@/components/common/error-screen';

import { getSession } from '@/action/action';
import { NavBarProvider } from '@/context/navbar-context';
import IsSmall from '@/layout/is-small';
import { hasAccess, isError } from '@/lib/utils';

// const PATH_PATTERN = /[a-zA-Z0-9-]+\/([a-zA-Z0-9/-]+)/;

export default async function NavigationBar({ children }: { children: ReactNode }) {
  const session = await getSession();

  if (isError(session)) {
    return <ErrorScreen error={session} />;
  }

  const routeGroups = groups.filter((group) => hasAccess(session, group.filter) && group.paths.some(({ path, filter }) => hasAccess(session, filter) && (typeof path === 'string' ? true : path.some((sub) => hasAccess(session, sub.filter)))));

  return (
    <NavBarProvider>
      <IsSmall
        small={
          <div className="grid h-full w-full grid-rows-[var(--nav)_1fr] overflow-hidden">
            <SmallScreenNavigationBar pathGroups={routeGroups} />
            <div className="relative h-full w-full overflow-hidden">{children}</div>
          </div>
        }
        notSmall={
          <div className="hidden h-full w-full grid-cols-[auto_1fr] justify-center sm:grid">
            <MediumScreenNavigationBar pathGroups={routeGroups} />
            <div className="relative h-full w-full overflow-hidden">{children}</div>
          </div>
        }
      />
    </NavBarProvider>
  );
}
