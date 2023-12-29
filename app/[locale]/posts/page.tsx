import PostsPage from '@/app/[locale]/posts/posts-page';
import getServerAPI from '@/query/config/axios-config';
import getQueryClient from '@/query/config/query-client';
import getMaps from '@/query/map/get-maps';
import { PageableSearchQuery } from '@/types/data/pageable-search-schema';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import React from 'react';

export default async function Page({
  searchParams,
}: {
  searchParams: PageableSearchQuery;
}) {
  const queryClient = getQueryClient();
  const { axios } = await getServerAPI();

  await queryClient.prefetchInfiniteQuery({
    initialPageParam: searchParams,
    queryKey: ['posts', searchParams],
    queryFn: (context) => getMaps(axios, context.pageParam),
  });
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <PostsPage />
    </HydrationBoundary>
  );
}
