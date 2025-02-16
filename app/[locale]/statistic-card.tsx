'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export default function StatisticCard({ children, delay }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        translateY: -10,
      }}
      whileInView={{
        opacity: 1,
        translateY: 0,
        transition: { duration: 1, delay },
      }}
    >
      {children}
    </motion.div>
  );
}
