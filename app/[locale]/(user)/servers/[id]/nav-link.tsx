'use client';

import { usePathname } from 'next/navigation';
import React, { ReactNode } from 'react';

import { cn } from '@/lib/utils';
import { useServerNavBar } from '@/zustand/server-nav-bar-store';
import InternalLink from '@/components/common/internal-link';

type Props = {
  id: string;
  href: string;
  label: ReactNode;
  icon: ReactNode;
};

export default function NavLink({ id, href, label, icon }: Props) {
  const visible = useServerNavBar((state) => state.visible);

  let pathname = usePathname();
  const firstSlash = pathname.indexOf('/', 1);
  pathname = pathname.slice(firstSlash);

  return (
    <InternalLink
      className={cn(
        'flex h-9 items-center gap-2 text-nowrap px-2 py-2 text-sm font-semibold opacity-70 transition-[gap] hover:rounded-sm hover:bg-brand hover:text-white hover:opacity-100',
        {
          'rounded-sm bg-brand text-white opacity-100': (pathname.endsWith(href) && href !== '') || (id !== '' && href === '' && pathname === `/servers/${id}`),
        },
        {
          'gap-0 delay-200': !visible,
          'w-full': visible,
        },
      )}
      key={href}
      href={`/servers/${id}/${href}`}
    >
      {icon}
      <span
        className={cn('w-40 overflow-hidden transition-[width] duration-200', {
          'w-0': !visible,
        })}
      >
        {label}
      </span>
    </InternalLink>
  );
}
