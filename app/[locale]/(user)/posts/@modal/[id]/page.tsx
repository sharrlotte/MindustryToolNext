import type { Metadata } from 'next';
import React from 'react';

import PostDetailCard from '@/components/post/post-detail-card';
import getServerApi from '@/query/config/get-server-api';
import { IdSearchParams } from '@/types/data/id-search-schema';
import { getPost } from '@/query/post';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;
  const axios = await getServerApi();
  const post = await getPost(axios, { id });

  return {
    title: post.title,
    description: post.content,
  };
}

export default async function Page({ params }: { params: IdSearchParams }) {
  const axios = await getServerApi();
  const post = await getPost(axios, params);

  console.log(post);

  return <PostDetailCard post={post} />;
}
