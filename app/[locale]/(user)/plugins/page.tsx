import PageClient from '@/app/[locale]/(user)/plugins/page.client';
import { sleep } from '@/lib/utils';
import React from 'react';

export default async function Page() {
  await sleep(10);
  return <PageClient />;
}
