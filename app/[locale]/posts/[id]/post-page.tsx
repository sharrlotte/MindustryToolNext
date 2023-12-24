'use client';

import PostDetail from '@/components/post/post-detail';
import LoadingSpinner from '@/components/ui/loading-spinner';
import useClient from '@/hooks/use-client';
import useSearchId from '@/hooks/use-search-id-params';
import getPost from '@/query/post/get-post';
import Post from '@/types/response/Post';
import { useQuery } from '@tanstack/react-query';
import { notFound } from 'next/navigation';
import React from 'react';

export default function PostPage() {
  const params = useSearchId();
  const { axiosClient, enabled } = useClient();

  const { data, isLoading, isError } = useQuery<Post>({
    queryKey: ['post', params],
    queryFn: () => getPost(axiosClient, params),
    enabled,
  });

  if (isLoading) {
    return (
      <LoadingSpinner className="absolute bottom-0 left-0 right-0 top-0" />
    );
  }

  if (isError) {
    return 'Error';
  }

  if (!data) {
    notFound();
  }

  return <PostDetail post={data} />;
}
