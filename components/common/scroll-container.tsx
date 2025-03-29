'use client';

import { usePathname } from 'next/navigation';
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
  const pathname = usePathname();
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const lastScrollTop = React.useRef(0);
  const [hasGapForScrollbar, setHasGapForScrollbar] = useState(false);

  useEffect(() => {
    if (container === null) return;

    setHasGapForScrollbar(container.scrollHeight > container.clientHeight);

    function handleScroll() {
      if (container) {
        setHasGapForScrollbar(container.scrollHeight > container.clientHeight);
      }
    }

    const observer = new ResizeObserver(() => {
      handleScroll();
    });

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [container, pathname]);

  useEffect(() => {
    if (container === null) return;

    const scrollTop = localStorage.getItem(`scroll-top-${pathname}`);
    try {
      if (scrollTop) {
        container.scrollTop = parseInt(scrollTop);
      } else {
        container.scrollTop = lastScrollTop.current;
      }
    } catch (error) {
      console.error(error);
    }
  }, [container, pathname]);

  return (
    <div
      id={id}
      className={cn('h-full scroll-container overflow-y-auto w-full', className, {
        [additionalPadding]: hasGapForScrollbar,
      })}
      onScroll={(event) => {
        lastScrollTop.current = event.currentTarget.scrollTop;
        localStorage.setItem(`scroll-top-${pathname}`, event.currentTarget.scrollTop.toString());
      }}
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
