'use client';

import { useParams } from 'next/navigation';
import React from 'react';

import { CommandCard, CommentLoadingCard } from '@/components/common/comment-section';
import InfinitePage from '@/components/common/infinite-page';
import ScrollContainer from '@/components/common/scroll-container';

import { getCommentsById } from '@/query/comment';

export default function PageClient() {
  const { id: commentId } = useParams();

  return (
    <ScrollContainer className="py-2 p-2">
      <InfinitePage
        className="flex gap-6 flex-col" //
        queryKey={[`comments-${commentId}`]}
        queryFn={(axios, params) => getCommentsById(axios, commentId as string, params)}
        params={{ page: 0, size: 20 }}
        noResult
        end
        skeleton={{
          amount: 10,
          item: <CommentLoadingCard />,
        }}
      >
        {(comment) => <CommandCard key={comment.id} comment={comment} />}
      </InfinitePage>
    </ScrollContainer>
  );
}
