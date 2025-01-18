'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { ReactNode, useMemo } from 'react';
import { useMediaQuery } from 'usehooks-ts';

import { Path, SubPath, groups } from '@/app/routes';

import { useSession } from '@/context/session-context.client';
import { hasAccess, max } from '@/lib/utils';

const MediumScreenNavigationBar = dynamic(() => import('@/app/[locale]/medium-navigation-items'));
const SmallScreenNavigationBar = dynamic(() => import('@/app/[locale]/small-navigation-items'));

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

  const routeGroups = useMemo(
    () => groups.filter((group) => hasAccess(session, group.filter) && group.paths.some(({ path, filter }) => hasAccess(session, filter) && (typeof path === 'string' ? true : path.some((sub) => hasAccess(session, sub.filter))))),
    [session],
  );

  if (isSmall) {
    return (
      <div className="grid h-full w-full grid-rows-[var(--nav)_1fr] overflow-hidden">
        <SmallScreenNavigationBar pathGroups={routeGroups} bestMatch={bestMatch} />
        <div className="h-full w-full flex overflow-hidden">{children}</div>
      </div>
    );
  }

  return (
    <div className="hidden h-full w-full grid-cols-[auto_1fr] justify-center sm:grid">
      <MediumScreenNavigationBar pathGroups={routeGroups} bestMatch={bestMatch} />
      <div className="h-full w-full flex overflow-hidden">{children}</div>
    </div>
  );
}

export function getPath(path: SubPath): string[] {
  if (typeof path === 'string') {
    return [path];
  }

  return path.reduce<string[]>((prev, curr) => prev.concat(curr.path), []);
}
