'use client';

import Image from 'next/image';
import React from 'react';

import { IMAGE_PREFIX } from '@/constant/constant';

type Props = {
  className?: string;
  data: string;
};

export default function RawImage({ className, data }: Props) {
  return <Image className={className} loader={({ src }) => src} src={IMAGE_PREFIX + data} alt="Map" width={512} height={512} />;
}
