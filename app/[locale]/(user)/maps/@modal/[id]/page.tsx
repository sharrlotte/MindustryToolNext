import { Metadata } from 'next';
import React from 'react';

import MapDetailCard from '@/components/map/map-detail-card';
import env from '@/constant/env';
import getServerAPI from '@/query/config/get-server-api';
import getMap from '@/query/map/get-map';
import { IdSearchParams } from '@/types/data/id-search-schema';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;
  const axios = await getServerAPI();
  const map = await getMap(axios, { id });

  return {
    title: map.name,
    description: map.description,
    openGraph: {
      title: map.name,
      description: map.description,
      images: `${env.url.api}/maps/${map.id}/image`,
    },
  };
}

export default async function Page({ params }: { params: IdSearchParams }) {
  const axios = await getServerAPI();
  const map = await getMap(axios, params);

  return <MapDetailCard map={map} />;
}
