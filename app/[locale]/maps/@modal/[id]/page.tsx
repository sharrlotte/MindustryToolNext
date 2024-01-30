import MapDetail from '@/components/map/map-detail';
import env from '@/constant/env';
import getServerAPI from '@/query/config/axios-config';
import getMap from '@/query/map/get-map';
import { IdSearchParams } from '@/types/data/id-search-schema';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;
  const { axios } = await getServerAPI();
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
  const { axios } = await getServerAPI();
  const map = await getMap(axios, params);

  if (!map) {
    return notFound();
  }

  return <MapDetail map={map} />;
}
