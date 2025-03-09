import React, { Suspense } from 'react';

import PageClient from '@/app/[locale]/(admin)/admin/comments/page.client';

export default function Page() {
  return (
    <Suspense>
      <PageClient />;
    </Suspense>
  );
}
