import React from 'react';

import UploadPostDetailCard from '@/components/post/upload-post-detail-card';
import getServerAPI from '@/query/config/get-server-api';
import { IdSearchParams } from '@/types/data/id-search-schema';
import { getPostUpload } from '@/query/post';
import Tran from '@/components/common/tran';
import BackButton from '@/components/ui/back-button';

export default async function Page({ params }: { params: IdSearchParams }) {
  const axios = await getServerAPI();
  const post = await getPostUpload(axios, params);

  if (post.isVerified === true) {
    return (
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-background">
        <Tran text="admin.item-has-been-verified" />
        <BackButton />
      </div>
    );
  }

  return <UploadPostDetailCard post={post} />;
}
