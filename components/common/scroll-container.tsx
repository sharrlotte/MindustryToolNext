'use client';

import React, { ReactNode, useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

type AdditionalPadding = `pr-${number}`;
type Props = {
  className?: string;
  additionalPadding?: AdditionalPadding;
  children: ReactNode;
};

const ScrollContainer = React.forwardRef<HTMLDivElement, Props>(({ className, additionalPadding = 'pr-2', children }, forwardedRef) => {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const lastScrollTop = React.useRef(0);
  const [hasGapForScrollbar, setHasGapForScrollbar] = useState(true);


  useEffect(() => {
    if (container === null) return;

    setHasGapForScrollbar(container.scrollHeight > container.clientHeight);

    function handleScroll() {
      if (container) {
        setHasGapForScrollbar(container.scrollHeight > container.clientHeight);
        lastScrollTop.current = container.scrollTop;
      }
    }

    container.addEventListener('scroll', handleScroll);

    const observer = new ResizeObserver(() => {
      handleScroll();
    });

    observer.observe(container);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, [container]);

  return (
    <div
      className={cn('h-full pagination-container overflow-y-auto overflow-x-hidden w-full', className, {
        [additionalPadding]: hasGapForScrollbar,
      })}
      ref={(current) => {
        if (typeof forwardedRef === 'function') {
          forwardedRef(current);
          setContainer(current);
        } else if (forwardedRef !== null) {
          forwardedRef.current = current;
        }
      }}
    >
      {children}
    </div>
  );
});

ScrollContainer.displayName = 'ScrollContainer';

export default ScrollContainer;
