'use client';

import React, { ReactNode, useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

type Props = {
  className?: string;
  children: ReactNode;
};

const ScrollContainer = React.forwardRef<HTMLDivElement, Props>(({ className, children }, ref) => {
  const [hasGapForScrollbar, setHasGapForScrollbar] = useState(false);
  const alterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref && 'current' in ref && ref.current) {
      const element = ref.current;
      const { addEventListener, removeEventListener } = element;

      const onResize = () => setHasGapForScrollbar(element.scrollHeight > element.clientHeight);

      onResize();
      addEventListener('resize', onResize);

      return () => removeEventListener('resize', onResize);
    } else if (alterRef.current) {
      const element = alterRef.current;
      const { addEventListener, removeEventListener } = element;

      const onResize = () => setHasGapForScrollbar(element.scrollHeight > element.clientHeight);

      onResize();
      addEventListener('resize', onResize);

      return () => removeEventListener('resize', onResize);
    }
  }, [ref]);

  return (
    <div
      className={cn('h-full overflow-y-auto w-full overflow-x-hidden', className, {
        'pr-2': hasGapForScrollbar,
      })}
      ref={ref || alterRef}
    >
      {children}
    </div>
  );
});

ScrollContainer.displayName = 'ScrollContainer';

export default ScrollContainer;
