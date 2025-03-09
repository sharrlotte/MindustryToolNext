import React, { Suspense } from 'react';

import PageClient from '@/app/[locale]/(main)/admin/comments/page.client';

export default function Page() {
  return (
    <Suspense>
      <PageClient />;
    </Suspense>
  );
}
