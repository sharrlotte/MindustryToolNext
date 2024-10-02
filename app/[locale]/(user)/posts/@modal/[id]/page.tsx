import type { Metadata } from 'next';
import React from 'react';

import PostDetailCard from '@/components/post/post-detail-card';
import { IdSearchParams } from '@/types/data/id-search-schema';
import { getPost } from '@/query/post';
import { serverApi } from '@/action/action';
import ErrorScreen from '@/components/common/error-screen';
import env from '@/constant/env';
import removeMd from 'remove-markdown';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;
  const post = await serverApi((axios) => getPost(axios, { id }));

  if ('error' in post) {
    throw post;
  }

  return {
    title: `${env.webName} > Post`,
    description: `${post.title} | ${removeMd(post.content)}`,
  };
}

export default async function Page({ params }: { params: IdSearchParams }) {
  const post = await serverApi((axios) => getPost(axios, params));

  if ('error' in post) {
    return <ErrorScreen error={post} />;
  }

  return <PostDetailCard post={post} />;
}
