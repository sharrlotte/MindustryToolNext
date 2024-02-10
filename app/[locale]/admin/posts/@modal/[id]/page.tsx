import UploadPostDetailCard from '@/components/post/upload-post-detail-card';
import getServerAPI from '@/query/config/get-server-api';
import getPost from '@/query/post/get-post';
import { IdSearchParams } from '@/types/data/id-search-schema';
import { notFound } from 'next/navigation';
import React from 'react';

export default async function Page({ params }: { params: IdSearchParams }) {
  const { axios } = await getServerAPI();
  const post = await getPost(axios, params);

  if (!post) {
    return notFound();
  }

  return <UploadPostDetailCard post={post} />;
}
