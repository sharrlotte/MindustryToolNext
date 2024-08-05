'use client';

import Image from 'next/image';
import React from 'react';

type Props = {
  src: string;
  errorSrc: string;
} & Parameters<typeof Image>[0];

export default function FallbackImage({ src, errorSrc, alt, ...props }: Props) {
  return (
    <Image
      src={src}
      width={224}
      height={224}
      alt={alt}
      onError={(err) => (err.currentTarget.src = errorSrc)}
      priority
      {...props}
    />
  );
}
