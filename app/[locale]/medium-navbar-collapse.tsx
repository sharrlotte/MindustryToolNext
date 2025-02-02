'use client';

import { Transition, motion } from 'framer-motion';
import React, { ReactNode } from 'react';

import { useNavBar } from '@/context/navbar-context';
import { cn } from '@/lib/utils';

type Props = {
  children: ReactNode;
};

const sidebarVariants = {
  open: {
    width: '235px',
    transition: { ease: ['easeIn', 'easeOut'], stiffness: 250, duration: 0.1 } as Transition,
  },
  closed: {
    width: 'var(--nav)',
    transition: { ease: ['easeIn', 'easeOut'], stiffness: 200, duration: 0.1 },
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
