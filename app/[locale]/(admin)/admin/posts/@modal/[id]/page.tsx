import React from 'react';

import UploadPostDetailCard from '@/components/post/upload-post-detail-card';
import { getPostUpload } from '@/query/post';
import Tran from '@/components/common/tran';
import BackButton from '@/components/ui/back-button';
import { isError } from '@/lib/utils';
import { serverApi } from '@/action/action';
import ErrorScreen from '@/components/common/error-screen';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  const post = await serverApi((axios) => getPostUpload(axios, { id }));

  if (isError(post)) {
    return <ErrorScreen error={post} />;
  }

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
