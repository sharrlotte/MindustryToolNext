import Image from 'next/image';
import React from 'react';

import router from '@/public/assets/blocks/router.png';

type Props = {
  message?: string;
};

export default function RouterSpinner({ message }: Props) {
  return (
    <div className="flex flex-col items-center justify-center">
      <h2>{message}</h2>
      <Image className="animate-spin" src={router} alt="router spinning" />
    </div>
  );
}
