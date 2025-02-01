'use client';

import React from 'react';

import Tran from '@/components/common/tran';

import { cn } from '@/lib/utils';

export function TagName({ className, children }: { className?: string; children: string }) {
  return (
    <span className={cn('text-sm flex flex-row flex-nowrap items-center gap-1 capitalize', className)}>
      <Tran asChild text={`tags.${children}`} />
    </span>
  );
}
