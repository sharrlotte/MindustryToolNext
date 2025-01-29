'use client';

import { motion } from 'framer-motion';
import React, { ReactNode } from 'react';

import { useNavBar } from '@/context/navbar-context';
import { cn } from '@/lib/utils';

type Props = {
  children: ReactNode;
};

const sidebarVariants = {
  open: {
    width: '235px',
    transition: { type: 'spring', stiffness: 250, damping: 25, duration: 0.5 },
  },
  closed: {
    width: 'var(--nav)',
    transition: { type: 'spring', stiffness: 200, damping: 25, duration: 0.5 },
  },
};

export default function MediumNavbarCollapse({ children }: Props) {
  const { visible } = useNavBar();

  return (
    <motion.div
      className={cn('relative gap-2 flex h-full overflow-hidden bg-card min-w-nav w-full flex-col p-1', { 'p-2': visible })}
      variants={sidebarVariants}
      initial={visible ? { width: sidebarVariants.open.width } : { width: sidebarVariants.closed.width }}
      animate={visible ? 'open' : 'closed'}
    >
      {children}
    </motion.div>
  );
}
