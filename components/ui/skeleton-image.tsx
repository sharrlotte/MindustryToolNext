'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

interface SkeletonImageProps {
  src: string;
  height?: string;
  width?: string;
  className?: string;
}

export default function SkeletonImage({ src, height = '16rem', width = '100%', className = '' }: SkeletonImageProps) {
  const [imageLoading, setImageLoading] = useState(true);
  const [pulsing, setPulsing] = useState(true);

  useEffect(() => {
    if (!imageLoading) {
      const timer = setTimeout(() => setPulsing(false), 600);
      return () => clearTimeout(timer);
    }
  }, [imageLoading]);

  const imageLoaded = () => {
    setImageLoading(false);
  };

  return (
    <div className={cn(`overflow-hidden bg-[#ccc] shadow-md`, pulsing ? 'animate-pulse' : '', className, `w-[${width}] h-[${height}]`)}>
      <motion.div
        initial={{ height: '0px', opacity: 0 }}
        animate={{
          height: imageLoading ? height : 'auto',
          opacity: imageLoading ? 0 : 1,
        }}
        transition={{
          height: { delay: 0, duration: 0.4 },
          opacity: { delay: 0.5, duration: 0.4 },
        }}
      >
        <Image alt="" onLoadingComplete={imageLoaded} src={src} layout="fill" objectFit="cover" className={cn('static block', className)} />
      </motion.div>
    </div>
  );
}
