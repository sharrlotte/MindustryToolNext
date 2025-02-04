'use client';

import { motion } from 'framer-motion';
import React, { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  delay?: number;
};
export default function FadeIn({ children, delay }: Props) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, ease: 'easeOut', delay: delay && delay / 5 }}>
      {children}
    </motion.div>
  );
}
