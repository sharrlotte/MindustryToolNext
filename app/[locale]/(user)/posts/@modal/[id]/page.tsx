import type { Metadata } from 'next';
import React from 'react';
import removeMd from 'remove-markdown';

import { serverApi } from '@/action/action';
import ErrorScreen from '@/components/common/error-screen';
import PostDetailCard from '@/components/post/post-detail-card';
import env from '@/constant/env';
import { isError } from '@/lib/utils';
import { getPost } from '@/query/post';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post = await serverApi((axios) => getPost(axios, { id }));

  if (isError(post)) {
    return { title: 'Error' };
  }

  return {
    title: `${env.webName} > Post`,
    description: `${post.title} | ${removeMd(post.content)}`,
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const post = await serverApi((axios) => getPost(axios, { id }));

  if (isError(post)) {
    return <ErrorScreen error={post} />;
  }

  return <PostDetailCard post={post} />;
}
