import Image from 'next/image';
import React from 'react';

import { cn } from '@/lib/utils';

export default function TagIcon({ className, children }: { className?: string; children?: string }) {
  if (!children) {
    return undefined;
  }
  return <Image loading="lazy" className={cn('size-4 shrink-0 rounded-md overflow-hidden', className)} src={children} width={28} height={28} alt={children} />;
}
