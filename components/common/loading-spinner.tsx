import { motion } from 'framer-motion';
import React, { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export default function LoadingSpinner({
  className,
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'pointer-events-none flex items-center justify-center',
        className,
      )}
      role="status"
    >
      <motion.div
        className="w-5 h-5 border-2 border-button m-10"
        animate={{
          scale: [1, 1.5, 1.5, 1, 1],
          rotate: [0, 0, 270, 270, 0],
          borderRadius: ['50%', '20%', '20%', '20%', '50%'],
        }}
        transition={{
          duration: 2,
          ease: 'easeInOut',
          times: [0, 0.2, 0.5, 0.8, 1],
          repeat: Infinity,
          repeatDelay: 1,
        }}
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
}
