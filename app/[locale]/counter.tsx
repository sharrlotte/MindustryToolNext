'use client';

import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { useEffect } from 'react';

const Counter = ({ from, to, duration = 2 }: { from: number; to: number; duration?: number }) => {
  const count = useMotionValue(from);
  const rounded = useTransform(count, (latest) => Math.floor(latest));

  useEffect(() => {
    count.set(from);
    const controls = animate(count, to, { duration });

    return () => controls.stop();
  }, [from, to, duration]);

  return <motion.p>{rounded}</motion.p>;
};

export default Counter;
