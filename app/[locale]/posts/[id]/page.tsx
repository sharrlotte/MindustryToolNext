import PostPage from '@/app/[locale]/posts/[id]/post-page';
import React from 'react';

import type { Metadata } from 'next';
import getPost from '@/query/post/get-post';
import getQueryClient from '@/query/config/query-client';
import { IdSearchParams } from '@/types/data/id-search-schema';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import getServer from '@/query/config/axios-config';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;
  const axiosServer = await getServer();
  const post = await getPost(axiosServer, { id });

  return {
    title: post.header,
  };
}

export default async function Page({ params }: { params: IdSearchParams }) {
  const queryClient = getQueryClient();
  const axiosServer = await getServer();

  await queryClient.prefetchQuery({
    queryKey: ['post', params],
    queryFn: () => getPost(axiosServer, params),
  });
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <PostPage />
    </HydrationBoundary>
  );
}
