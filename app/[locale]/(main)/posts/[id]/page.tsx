import type { Metadata } from 'next';
import React, { cache } from 'react';
import removeMd from 'remove-markdown';

import ErrorScreen from '@/components/common/error-screen';
import PostDetailCard from '@/components/post/post-detail-card';

import { serverApi } from '@/action/action';
import { Locale } from '@/i18n/config';
import { YOUTUBE_VIDEO_REGEX, formatTitle, isError } from '@/lib/utils';
import { getPost } from '@/query/post';

type Props = {
  params: Promise<{ id: string; locale: Locale }>;
};

const getCachedPost = cache((id: string) => serverApi((axios) => getPost(axios, { id })));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post = await getCachedPost(id);

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
  const post = await getCachedPost(id);

  if (isError(post)) {
    return <ErrorScreen error={post} />;
  }

  return <PostDetailCard post={post} />;
}
