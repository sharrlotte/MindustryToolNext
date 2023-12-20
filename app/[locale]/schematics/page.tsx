import React from 'react';
import SchematicsPage from './schematics-page';
import getQueryClient from '@/query/config/query-client';
import getMaps from '@/query/map/get-maps';
import { SearchParams } from '@/types/data/search-schema';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import getServer from '@/query/config/axios-config';
export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const queryClient = getQueryClient();
  const axiosServer = await getServer();
  queryClient.prefetchInfiniteQuery({
    initialPageParam: searchParams,
    queryKey: ['schematics', searchParams],
    queryFn: (context) => getMaps(axiosServer, context.pageParam),
  });
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <SchematicsPage />
    </HydrationBoundary>
  );
}
