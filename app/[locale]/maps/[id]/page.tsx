import MapPage from '@/app/[locale]/maps/[id]/map-page';
import env from '@/constant/env';
import getServerAPI from '@/query/config/axios-config';
import getQueryClient from '@/query/config/query-client';
import getMap from '@/query/map/get-map';
import { IdSearchParams } from '@/types/data/id-search-schema';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Metadata } from 'next';
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
    openGraph: {
      title: map.name,
      images: `${env.url.api}/maps/${map.id}/image`,
    },
  };
}

export default async function Page({ params }: { params: IdSearchParams }) {
  const queryClient = getQueryClient();
  const { axios } = await getServerAPI();

  await queryClient.prefetchQuery({
    queryKey: ['map', params],
    queryFn: () => getMap(axios, params),
  });
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <MapPage />
    </HydrationBoundary>
  );
}
