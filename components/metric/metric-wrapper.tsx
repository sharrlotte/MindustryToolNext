import { ExpandIcon, ShrinkIcon } from '@/components/common/icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import React, { ReactNode, useState } from 'react';

type Props = {
  children: ReactNode;
};

export default function MetricWrapper({ children }: Props) {
  const [expand, setExpand] = useState(false);

  return (
    <div
      className={cn('relative', {
        'absolute inset-0 z-10 max-h-[calc(100dvh-var(--nav))]': expand,
      })}
    >
      {expand ? (
        <Button
          className="absolute right-1 top-1"
          variant="ghost"
          onClick={() => setExpand(false)}
        >
          <ShrinkIcon />
        </Button>
      ) : (
        <Button
          className="absolute right-1 top-1"
          variant="ghost"
          onClick={() => setExpand(true)}
        >
          <ExpandIcon />
        </Button>
      )}
      {children}
    </div>
  );
}
