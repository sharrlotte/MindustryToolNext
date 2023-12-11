import PostPage from '@/app/[locale]/posts/[id]/post-page';
import React from 'react';

import type { Metadata } from 'next';
import getPost from '@/query/post/get-post';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;
  const post = await getPost({ id });

  return {
    title: post.header,
  };
}

export default function Page() {
  return <PostPage />;
}
