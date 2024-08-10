'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { ReactNode } from 'react';

import { cn } from '@/lib/utils';
import { useExpandServerNav } from '@/zustand/expand-nav';

type Props = {
  id: string;
  href: string;
  label: ReactNode;
  icon: ReactNode;
};

export default function NavLink({ id, href, label, icon }: Props) {
  const expand = useExpandServerNav((state) => state.expand);

  let pathname = usePathname();
  const firstSlash = pathname.indexOf('/', 1);
  pathname = pathname.slice(firstSlash);

  return (
    <Link
      className={cn(
        'flex items-center gap-2 text-nowrap px-2 py-2 text-sm font-semibold opacity-70 transition-[gap] hover:rounded-sm hover:bg-brand hover:text-white hover:opacity-100',
        {
          'rounded-sm bg-brand text-white opacity-100':
            (pathname.endsWith(href) && href !== '') ||
            (id !== '' && href === '' && pathname === `/servers/${id}`),
        },
        {
          'gap-0 delay-200': !expand,
          'w-full': expand,
        },
      )}
      key={href}
      href={`/servers/${id}/${href}`}
    >
      {icon}
      <span
        className={cn('w-40 overflow-hidden transition-[width] duration-200', {
          'w-0': !expand,
        })}
      >
        {label}
      </span>
    </Link>
  );
}
