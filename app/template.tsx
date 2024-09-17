'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function Template({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <motion.div
      className="h-full overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ ease: 'easeInOut', duration: 0.75, delay: 0.14 }}
      onAnimationComplete={() => router.refresh()}
    >
      {children}
    </motion.div>
  );
}
