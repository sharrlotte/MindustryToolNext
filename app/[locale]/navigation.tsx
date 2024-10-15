'use client';

import { ReactNode, useMemo } from 'react';

import { SmallScreenNavigationBar } from '@/app/[locale]/small-navigation-items';
import { hasAccess, max } from '@/lib/utils';

import { useMediaQuery } from 'usehooks-ts';
import { MediumScreenNavigationBar } from '@/app/[locale]/medium-navigation-items';
import { useSession } from '@/context/session-context.client';
import { usePathname } from 'next/navigation';
import { groups, Path, SubPath } from '@/app/routes';

const PATH_PATTERN = /[a-zA-Z0-9-]+\/([a-zA-Z0-9/-]+)/;

export default function NavigationBar({ children }: { children: ReactNode }) {
  const isSmall = useMediaQuery('(max-width: 640px)');
  const { session } = useSession();
  const pathName = usePathname();

  const bestMatch = useMemo(() => {
    const route = '/' + PATH_PATTERN.exec(pathName)?.at(1);

    const allPaths: string[] = groups
      .reduce<Path[]>((prev, curr) => prev.concat(curr.paths), []) //
      .reduce<string[]>((prev, curr) => prev.concat(getPath(curr.path)), []);

    return max(allPaths, (value) => value.length * (route.startsWith(value) ? 1 : 0));
  }, [pathName]);

  const routeGroups = useMemo(() => groups.filter((group) => hasAccess(session, group.filter) && group.paths.some(({ path, filter }) => hasAccess(session, filter) && (typeof path === 'string' ? true : path.some((sub) => hasAccess(session, sub.filter))))), [session]);

  if (isSmall) {
    return (
      <SmallScreenNavigationBar pathGroups={routeGroups} bestMatch={bestMatch}>
        {children}
      </SmallScreenNavigationBar>
    );
  }

  return (
    <MediumScreenNavigationBar pathGroups={routeGroups} bestMatch={bestMatch}>
      {children}
    </MediumScreenNavigationBar>
  );
}

export function getPath(path: SubPath): string[] {
  if (typeof path === 'string') {
    return [path];
  }

  return path.reduce<string[]>((prev, curr) => prev.concat(curr.path), []);
}
