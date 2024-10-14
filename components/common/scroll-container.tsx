'use client';

import { cn } from '@/lib/utils';
import React, { ReactNode } from 'react';

type Props = {
  className?: string;
  children: ReactNode;
};

export default function ScrollContainer({ className, children }: Props) {
  const [container, setContainer] = React.useState<HTMLDivElement | null>();

  const scrollHeight = container?.scrollHeight || 0;
  const clientHeigh = container?.clientHeight || 0;

  const hasGapForScrollbar = scrollHeight > clientHeigh;

  return (
    <div
      className={cn('overflow-y-auto overflow-x-hidden', className, {
        'pr-2': hasGapForScrollbar,
      })}
      ref={setContainer}
    >
      {children}
    </div>
  );
}
