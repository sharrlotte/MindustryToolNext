import SchematicPage from '@/app/[locale]/schematics/[id]/schematic-page';
import env from '@/constant/env';
import getServer from '@/query/config/axios-config';
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
  const axiosServer = await getServer();
  const map = await getSchematic(axiosServer, { id });

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
  const axiosServer = await getServer();

  await queryClient.prefetchQuery({
    queryKey: ['schematic', params],
    queryFn: () => getSchematic(axiosServer, params),
  });
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <SchematicPage />
    </HydrationBoundary>
  );
}
