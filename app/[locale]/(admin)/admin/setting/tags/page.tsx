import React, { Suspense } from 'react';

import PageClient from '@/app/[locale]/(admin)/admin/setting/tags/page.client';

import LoadingScreen from '@/components/common/loading-screen';

export const experimental_ppr = true;

export default function Page() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <PageClient />
    </Suspense>
  );
}
