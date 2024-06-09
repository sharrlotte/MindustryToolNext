'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { ReactNode } from 'react';

import { cn } from '@/lib/utils';
import { useExpand } from '@/zustand/expand-nav';

type Props = {
  id: string;
  href: string;
  label: ReactNode;
  icon: ReactNode;
};

export default function NavLink({ id, href, label, icon }: Props) {
  const expand = useExpand((state) => state.expand);

  let pathname = usePathname();
  let firstSlash = pathname.indexOf('/', 1);
  pathname = pathname.slice(firstSlash);

  return (
    <Link
      className={cn(
        'items-center flex text-nowrap px-2 py-2 text-sm font-semibold opacity-70 hover:rounded-sm hover:bg-button hover:text-white hover:opacity-100 gap-2 transition-[gap]',
        {
          'rounded-sm bg-button text-white opacity-100':
            (pathname.endsWith(href) && href !== '') ||
            (id !== '' && href === '' && pathname === `/admin/servers/${id}`),
        },
        {
          'gap-0 delay-200': !expand,
        },
      )}
      key={href}
      href={`/admin/servers/${id}/${href}`}
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
