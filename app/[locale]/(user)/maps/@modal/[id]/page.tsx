import { Metadata } from 'next/dist/types';
import React, { cache } from 'react';

import ErrorScreen from '@/components/common/error-screen';
import MapDetailCard from '@/components/map/map-detail-card';

import { serverApi } from '@/action/action';
import env from '@/constant/env';
import { Locale } from '@/i18n/config';
import { formatTitle, isError } from '@/lib/utils';
import { getMap } from '@/query/map';

type Props = {
  params: Promise<{ id: string; locale: Locale }>;
};

export const experimental_ppr = true;

const getCachedMap = cache((id: string) => serverApi((axios) => getMap(axios, { id })));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const map = await getCachedMap(id);

  if (isError(map)) {
    return { title: 'Error' };
  }

  const { name, description } = map;

  return {
    title: formatTitle(name),
    description: [name, description].join('|'),
    openGraph: {
      title: name,
      description: description,
      images: `${env.url.image}/maps/${id}${env.imageFormat}`,
    },
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const map = await getCachedMap(id);

  if (isError(map)) {
    return <ErrorScreen error={map} />;
  }

  return <MapDetailCard map={map} />;
}
