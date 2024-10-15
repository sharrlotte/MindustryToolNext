'use client';

import { cn } from '@/lib/utils';
import React, { ReactNode, useEffect, useState } from 'react';

type Props = {
  className?: string;
  children: ReactNode;
};

const ScrollContainer = React.forwardRef<HTMLDivElement, Props>(({ className, children }, ref) => {
  const [hasGapForScrollbar, setHasGapForScrollbar] = useState(false);

  useEffect(() => {
    if (ref && 'current' in ref && ref.current) {
      const { scrollHeight, clientHeight } = ref.current;
      setHasGapForScrollbar(scrollHeight > clientHeight);
    }
  }, [ref]);

  return (
    <div
      className={cn('h-full overflow-y-auto overflow-x-hidden', className, {
        'pr-2': hasGapForScrollbar,
      })}
      ref={ref}
    >
      {children}
    </div>
  );
});

ScrollContainer.displayName = 'ScrollContainer';

export default ScrollContainer;
