'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import React, { ReactNode } from 'react';

import InternalLink from '@/components/common/internal-link';

import { cn } from '@/lib/utils';

type Props = {
  href: string;
  label: ReactNode;
  icon: ReactNode;
  hovered: string;
  root: string;
  setHovered: (value: string) => void;
};

export default function NavLink({ root, href, label, icon, hovered, setHovered }: Props) {
  const pathname = usePathname();
  const firstSlash = pathname.indexOf('/', 1);
  const route = pathname.slice(firstSlash);

  const isSelected = (route.endsWith(href) && href !== '') || (href === '' && route === `/${root}`);
  const isHovered = href === hovered;

  return (
    <InternalLink
      className={cn('relative inline-flex h-12 min-w-fit items-center justify-center gap-2 text-nowrap px-0 py-2 text-sm text-foreground/70 hover:text-foreground', {
        'text-foreground': isSelected,
      })}
      href={`/${root}/${href}`}
      onMouseEnter={() => setHovered(href)}
      onTouchStart={() => setHovered(href)}
    >
      <div className="relative w-full">
        {isHovered && <motion.div layoutId="hovered" className="absolute inset-0 z-0 rounded-sm bg-muted" />}
        {isSelected && <motion.div layoutId="indicator" className="absolute bottom-0 left-0 right-0 h-0.5 border-b-[3px] border-foreground" />}
        <div
          className={cn('relative z-10 bg-transparent p-2 text-foreground/70 hover:text-foreground', {
            'text-foreground': isSelected,
          })}
        >
          <div className="relative flex w-fit items-center justify-center gap-1 rounded-sm">
            <span>{icon}</span>
            <span>{label}</span>
          </div>
        </div>
      </div>
    </InternalLink>
  );
}
