import { Metadata } from 'next';
import React from 'react';

import MapDetailCard from '@/components/map/map-detail-card';
import env from '@/constant/env';
import { IdSearchParams } from '@/types/data/id-search-schema';
import { getMap } from '@/query/map';
import { serverApi } from '@/action/action';
import ErrorScreen from '@/components/common/error-screen';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;
  const map = await serverApi((axios) => getMap(axios, { id }));

  if ('error' in map) {
    throw map;
  }

  return {
    title: `${env.webName} > Map`,
    description: `${map.name} | ${map.description}`,
    openGraph: {
      title: map.name,
      description: map.description,
      images: `${env.url.image}map-previews/${map.id}.png`,
    },
  };
}

export default async function Page({ params }: { params: IdSearchParams }) {
  const map = await serverApi((axios) => getMap(axios, params));

  if ('error' in map) {
    return <ErrorScreen error={map} />;
  }

  return <MapDetailCard map={map} />;
}
