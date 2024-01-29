import React from 'react';

import type { Metadata } from 'next';
import getPost from '@/query/post/get-post';
import { IdSearchParams } from '@/types/data/id-search-schema';
import getServerAPI from '@/query/config/axios-config';
import { notFound } from 'next/navigation';
import PostDetail from '@/components/post/post-detail';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;
  const { axios } = await getServerAPI();
  const post = await getPost(axios, { id });

  return {
    title: post.header,
    description: post.content,
  };
}

export default async function Page({ params }: { params: IdSearchParams }) {
  const { axios } = await getServerAPI();
  const post = await getPost(axios, params);

  if (!post) {
    return notFound();
  }

  return <PostDetail post={post} />;
}
