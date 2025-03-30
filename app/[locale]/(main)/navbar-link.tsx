'use client';

import { usePathname } from 'next/navigation';
import React from 'react';

import { useNavBar } from '@/context/navbar-context';
import { useSession } from '@/context/session-context';
import { Filter, cn, hasAccess } from '@/lib/utils';
import InternalLink from '@/components/common/internal-link';

type Props = {
  children: React.ReactNode;
  path: string;
  regex: string[];
  filter?: Filter;
};
export default function NavbarLink({ children, path, regex, filter }: Props) {
  const { session } = useSession();

  if (filter) {
    return hasAccess(session, filter) ? (
      <NavbarLinkInternal path={path} regex={regex} filter={filter}>
        {children}
      </NavbarLinkInternal>
    ) : undefined;
  }

  return (
    <NavbarLinkInternal path={path} regex={regex} filter={filter}>
      {children}
    </NavbarLinkInternal>
  );
}

function NavbarLinkInternal({ children, path, regex }: Props) {
  const { visible, setVisible } = useNavBar();
  const currentPath = usePathname();

  return (
    <InternalLink
      className={cn('flex h-10 items-center capitalize justify-center rounded-md p-1 hover:bg-brand hover:text-brand-foreground', {
        'bg-brand text-brand-foreground': regex.some((r) => currentPath.match(r)),
        'justify-start gap-2 py-2': visible,
        'w-10': !visible,
      })}
      href={path}
      aria-label={path}
      onClick={() => setVisible(false)}
    >
      {children}
    </InternalLink>
  );
}
