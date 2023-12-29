import SchematicPage from '@/app/[locale]/schematics/[id]/schematic-page';
import env from '@/constant/env';
import getServerAPI from '@/query/config/axios-config';
import getQueryClient from '@/query/config/query-client';
import getSchematic from '@/query/schematic/get-schematic';
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
  const map = await getSchematic(axios, { id });

  return {
    title: map.name,
    openGraph: {
      title: map.name,
      images: `${env.url.api}/schematics/${map.id}/image`,
    },
  };
}
export default async function Page({ params }: { params: IdSearchParams }) {
  const queryClient = getQueryClient();
  const { axios } = await getServerAPI();

  await queryClient.prefetchQuery({
    queryKey: ['schematic', params],
    queryFn: () => getSchematic(axios, params),
  });
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <SchematicPage />
    </HydrationBoundary>
  );
}
