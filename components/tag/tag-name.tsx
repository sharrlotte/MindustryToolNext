'use client';

import Image from 'next/image';
import React, { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export function TagName({ className, icon, children }: { className?: string; icon?: string; children: ReactNode }) {
  return (
    <span className={cn('text-sx flex flex-row flex-nowrap items-center gap-1 capitalize', className)}>
      {icon && icon.length > 0 && <Image loading="lazy" className="h-4 min-h-4 w-4 min-w-4" src={icon} width={16} height={16} alt={icon} />}
      {children}
    </span>
  );
}
