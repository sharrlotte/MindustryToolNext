'use client';

import { ExpandIcon, ShrinkIcon } from '@/components/common/icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import React, { ReactNode, useState } from 'react';

type Props = {
  className?: string;
  children: ReactNode;
};

export default function MetricWrapper({ className, children }: Props) {
  const [expand, setExpand] = useState(false);

  return (
    <div
      className={cn('relative flex h-full w-full bg-card', className, {
        'absolute inset-0 z-10': expand,
      })}
    >
      {expand ? (
        <Button className="absolute right-1 top-1" variant="ghost" onClick={() => setExpand(false)}>
          <ShrinkIcon />
        </Button>
      ) : (
        <Button className="absolute right-1 top-1" variant="ghost" onClick={() => setExpand(true)}>
          <ExpandIcon />
        </Button>
      )}
      {children}
    </div>
  );
}
