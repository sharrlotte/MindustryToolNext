import Image from 'next/image';
import React from 'react';

import router from '@/public/assets/blocks/router.png';
import { cn } from '@/lib/utils';

type Props = {
  className?: string;
  message?: string;
};

export default function RouterSpinner({ className, message }: Props) {
  return (
    <div
      className={cn('flex flex-col items-center justify-center p-4', className)}
    >
      <h2>{message}</h2>
      <Image className="animate-spin" src={router} alt="router spinning" />
    </div>
  );
}
