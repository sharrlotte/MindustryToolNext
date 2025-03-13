'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export default function FlyIn({ className, children, delay, dir = 'top', distance = 10 }: { className?: string; children: ReactNode; delay?: number; dir?: 'top' | 'bottom' | 'left' | 'right'; distance?: number }) {
  const translate = dir === 'top' ? { translateY: distance } : dir === 'bottom' ? { translateY: -distance } : dir === 'left' ? { translateX: -distance } : { translateX: distance };

  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        ...translate,
      }}
      viewport={{ once: true }}
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
