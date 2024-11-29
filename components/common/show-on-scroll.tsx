import { motion } from 'framer-motion';
import { useMemo } from 'react';

import { cn } from '@/lib/utils';
import { useSearchBarVisibility } from '@/zustand/auto-hide-search-store';

type Dir = 'width' | 'height';

type Props = {
  className?: string;
  dir: Dir;
  children: React.ReactNode;
};

export function ShowOnScroll({ className, dir, children }: Props) {
  const { visible } = useSearchBarVisibility();

  console.log({ visible });

  const sidebarVariants = useMemo(
    () => ({
      open: {
        [dir]: '60px',
        transition: { type: 'spring', duration: 0.1 },
      },
      closed: {
        [dir]: '0',
        transition: { type: 'spring', duration: 0.1 },
      },
    }),
    [dir],
  );

  return (
    <motion.div className={cn('overflow-hidden', className)} variants={sidebarVariants} initial={visible ? { [dir]: sidebarVariants.open[dir] } : { [dir]: sidebarVariants.closed[dir] }} animate={visible ? 'open' : 'closed'}>
      {children}
    </motion.div>
  );
}
