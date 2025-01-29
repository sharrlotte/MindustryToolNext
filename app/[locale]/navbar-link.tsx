'use client';

import { usePathname } from 'next/navigation';
import React from 'react';

import NavbarVisible from '@/app/navbar-visible';

import InternalLink from '@/components/common/internal-link';

import { useNavBar } from '@/context/navbar-context';
import { cn } from '@/lib/utils';

type Props = {
  path: string;
  name: React.ReactNode;
  icon: React.ReactNode;
  regex: string[];
};
export default function NavbarLink({ name, icon, path, regex }: Props) {
  const { visible } = useNavBar();
  const currentPath = usePathname();

  return (
    <InternalLink
      className={cn('flex h-10 items-center justify-center rounded-md p-1 hover:bg-brand hover:text-brand-foreground', {
        'bg-brand text-brand-foreground': regex.some((r) => currentPath.match(r)),
        'justify-start gap-2 py-2': visible,
        'w-10': !visible,
      })}
      href={path}
    >
      {icon}
      <NavbarVisible>{name}</NavbarVisible>
    </InternalLink>
  );
}
