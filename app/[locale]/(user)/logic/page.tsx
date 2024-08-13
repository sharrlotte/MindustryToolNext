'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const NoSSRComponent = dynamic(
  () => import('@/app/[locale]/(user)/logic/editor'),
  {
    ssr: false,
  },
);

export default function TestsPage() {
  return <NoSSRComponent />;
}
