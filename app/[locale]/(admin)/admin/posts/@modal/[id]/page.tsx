import React from 'react';



import ErrorScreen from '@/components/common/error-screen';
import Tran from '@/components/common/tran';
import UploadPostDetailCard from '@/components/post/upload-post-detail-card';
import BackButton from '@/components/ui/back-button';



import { serverApi } from '@/action/action';
import { formatTitle, isError, YOUTUBE_VIDEO_REGEX } from '@/lib/utils';
import { getPostUpload } from '@/query/post';
import { Metadata } from 'next';
import removeMd from 'remove-markdown';


type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post = await serverApi((axios) => getPostUpload(axios, { id }));

  if (isError(post)) {
    return { title: 'Error' };
  }

  const urls = YOUTUBE_VIDEO_REGEX.exec(post.content) ?? [];

  const { title, content, imageUrls } = post;

  return {
    title: formatTitle(title),
    description: [title, removeMd(content)].join('|'),
    openGraph: {
      title: formatTitle(title),
      description: [title, removeMd(content)].join('|'),
      images: imageUrls.concat([...urls]),
    },
  };
}

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
