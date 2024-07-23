import Image from 'next/image';
import React from 'react';

import router from '@/public/assets/blocks/router.png';

type Props = {
  message?: string;
};

export default function ErrorSpinner({ message }: Props) {
  return (
    <div className="flex justify-center items-center flex-col">
      <h2>{message}</h2>
      <Image className="animate-spin" src={router} alt="router spinning" />
    </div>
  );
}
