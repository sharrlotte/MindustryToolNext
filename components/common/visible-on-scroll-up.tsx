'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

type Props = {
  className?: string;
  children: React.ReactNode;
};
export default function VisibleOnScrollUp({ className, children }: Props) {
  const [open, setOpen] = useState(true);

  const lastScrollTop = useRef(0);

  useEffect(() => {
    const containers = document.getElementsByClassName('scroll-container');

    function onScroll(event: any) {
      setOpen(event.target.scrollTop < lastScrollTop.current);
      lastScrollTop.current = event.target.scrollTop;
    }

    let container: HTMLElement | undefined;

    if (containers) {
      //
      container = containers[0] as HTMLElement;

      container.addEventListener('scroll', onScroll);
    }

    return () => container?.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.div
      className={cn('overflow-hidden shrink-0', className)}
      animate={open ? 'open' : 'closed'}
      variants={{
        open: {
          height: 'auto',
        },
        closed: {
          height: 0,
        },
      }}
    >
      {children}
    </motion.div>
  );
}
