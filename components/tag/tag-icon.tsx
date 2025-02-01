import Image from 'next/image';
import React from 'react';

export default function TagIcon({ children }: { children?: string }) {
  if (!children) {
    return undefined;
  }
  return <Image loading="lazy" className="size-7 min-h-7 min-w-7 rounded-md overflow-hidden" src={children} width={28} height={28} alt={children} />;
}
