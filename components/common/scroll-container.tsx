'use client';

import React, { ReactNode, useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

type AdditionalPadding = `pr-${number}`;
type Props = {
  id?: string;
  className?: string;
  additionalPadding?: AdditionalPadding;
  children: ReactNode;
};

const ScrollContainer = React.forwardRef<HTMLDivElement, Props>(({ className, id, additionalPadding = 'pr-2', children }, forwardedRef) => {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const lastScrollTop = React.useRef(0);
  const [hasGapForScrollbar, setHasGapForScrollbar] = useState(false);

  useEffect(() => {
    if (container === null) return;

    setHasGapForScrollbar(container.scrollHeight > container.clientHeight);

    function handleScroll() {
      if (container) {
        setHasGapForScrollbar(container.scrollHeight > container.clientHeight);
        lastScrollTop.current = container.scrollTop;
      }
    }

    const observer = new ResizeObserver(() => {
      handleScroll();
    });

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [container]);

  return (
    <div
      id={id}
      className={cn('h-full scroll-container overflow-y-auto w-full', className, {
        [additionalPadding]: hasGapForScrollbar,
      })}
      ref={(current) => {
        if (typeof forwardedRef === 'function') {
          forwardedRef(current);
          setContainer(current);
        } else if (forwardedRef !== null) {
          forwardedRef.current = current;
        } else {
          setContainer(current);
        }
      }}
    >
      {children}
    </div>
  );
});

ScrollContainer.displayName = 'ScrollContainer';

export default ScrollContainer;
