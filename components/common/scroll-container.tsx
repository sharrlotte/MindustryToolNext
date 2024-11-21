'use client';

import React, { ReactNode, useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

type Props = {
  className?: string;
  children: ReactNode;
};

const ScrollContainer = React.forwardRef<HTMLDivElement, Props>(({ className, children }, forwardedRef) => {
  const localRef = useRef<HTMLDivElement>(null);
  const ref = (forwardedRef as React.RefObject<HTMLDivElement>) || localRef;

  const [hasGapForScrollbar, setHasGapForScrollbar] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver(() => {
      setHasGapForScrollbar(element.scrollHeight > element.clientHeight);
    });

    resizeObserver.observe(element);

    return () => resizeObserver.disconnect();
  }, [ref]);

  return (
    <div
      className={cn('h-full overflow-y-auto w-full overflow-x-hidden', className, {
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
