import React from 'react';
import MapsPage from './maps-page';
import getQueryClient from '@/query/config/query-client';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import getMaps from '@/query/map/get-maps';
import { SearchParams } from '@/types/data/search-schema';
import getServer from '@/query/config/axios-config';

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const queryClient = getQueryClient();
  const axiosServer = await getServer();

  await queryClient.prefetchInfiniteQuery({
    initialPageParam: searchParams,
    queryKey: ['maps', searchParams],
    queryFn: (context) => getMaps(axiosServer, context.pageParam),
  });
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <MapsPage />
    </HydrationBoundary>
  );
}
