'use client';

import dynamic from 'next/dynamic';
import React, { ReactNode } from 'react';

const MotionDiv = dynamic(() => import('framer-motion').then((result) => result.motion.div));

type Props = {
  children: ReactNode;
  delay?: number;
};
export default function FadeIn({ children, delay }: Props) {
  return (
    <MotionDiv className="h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, ease: 'easeOut', delay: delay && delay / 10 }}>
      {children}
    </MotionDiv>
  );
}