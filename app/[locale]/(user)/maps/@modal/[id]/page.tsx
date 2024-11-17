import { Metadata } from 'next/dist/types';
import React from 'react';

import { serverApi } from '@/action/action';
import ErrorScreen from '@/components/common/error-screen';
import MapDetailCard from '@/components/map/map-detail-card';
import env from '@/constant/env';
import { isError } from '@/lib/utils';
import { getMap } from '@/query/map';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const map = await serverApi((axios) => getMap(axios, { id }));

  if (isError(map)) {
    return { title: 'Error' };
  }

  return {
    title: `${env.webName} > Map`,
    description: `${map.name} | ${map.description}`,
    openGraph: {
      title: map.name,
      description: map.description,
      images: `${env.url.image}/map-previews/${map.id}${env.imageFormat}`,
    },
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const map = await serverApi((axios) => getMap(axios, { id }));

  if (isError(map)) {
    return <ErrorScreen error={map} />;
  }

  return <MapDetailCard map={map} />;
}
