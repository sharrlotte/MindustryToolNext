import React from 'react';

import UploadPostDetailCard from '@/components/post/upload-post-detail-card';
import getServerAPI from '@/query/config/get-server-api';
import getPostUpload from '@/query/post/get-post-upload';
import { IdSearchParams } from '@/types/data/id-search-schema';

export default async function Page({ params }: { params: IdSearchParams }) {
  const axios = await getServerAPI();
  const post = await getPostUpload(axios, params);

  return <UploadPostDetailCard post={post} />;
}
