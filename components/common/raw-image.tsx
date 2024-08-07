'use client';

import React from 'react';
import Image from 'next/image';
import { PNG_IMAGE_PREFIX } from '@/constant/constant';

type Props = {
  data: string;
};

export default function RawImage({ data }: Props) {
  return (
    <Image
      loader={({ src }) => src}
      src={PNG_IMAGE_PREFIX + data}
      alt="Map"
      width={512}
      height={512}
    />
  );
}
