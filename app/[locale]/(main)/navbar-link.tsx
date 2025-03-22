'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

import { useNavBar } from '@/context/navbar-context';
import { cn } from '@/lib/utils';

type Props = {
  children: React.ReactNode;
  path: string;
  regex: string[];
};
export default function NavbarLink({ children, path, regex }: Props) {
  const { visible, setVisible } = useNavBar();
  const currentPath = usePathname();

  return (
    <Link
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
    </Link>
  );
}
