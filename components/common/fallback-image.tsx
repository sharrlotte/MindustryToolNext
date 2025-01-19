'use client';

import Image from 'next/image';
import React, { useState } from 'react';

type Props = {
  src: string;
  errorSrc: string;
} & Parameters<typeof Image>[0];

export default function FallbackImage({ src, errorSrc, alt, ...props }: Props) {
  const [isError, setError] = useState(false);

  return <Image src={isError ? errorSrc : src} loader={({src}) => src} width={224} height={224} alt={alt} onError={() => setError(true)} {...props} />;
}
