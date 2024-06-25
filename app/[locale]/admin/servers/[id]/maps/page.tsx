import { setStaticParamsLocale } from 'next-international/server';
import React from 'react';

import ServerMaps from '@/app/[locale]/admin/servers/[id]/maps/server-maps';

export default async function Page({ params: { locale } }: any) {
  await setStaticParamsLocale(locale);

  return <ServerMaps />;
}
