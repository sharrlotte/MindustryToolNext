'use client';

import Image from 'next/image';
import React, { ReactNode } from 'react';

import { cn, icons } from '@/lib/utils';

export function TagName({ className, value, children }: { className?: string; value: string; children: ReactNode }) {
  const icon = icons[value];

  return (
    <span className={cn('text-sx flex flex-row flex-nowrap items-center gap-1 capitalize', className)}>
      {icon && <Image loading='lazy' className="h-4 min-h-4 w-4 min-w-4" src={`/assets/sprite/${icon}`} width={16} height={16} alt={value} />}
      {children}
    </span>
  );
}
