'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const NoSSRComponent = dynamic(() => import('./main/editor'), { ssr: false });
export default function Page() {
  return <NoSSRComponent />;
}
