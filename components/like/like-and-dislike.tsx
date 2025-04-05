'use client'

import DislikeButton from '@/components/like/dislike-button';
import LikeButton from '@/components/like/like-button';
import LikeComponent from '@/components/like/like-component';
import { Batcher } from '@/lib/batcher';

import { useQuery } from '@tanstack/react-query';

type Props = {
  itemId: string
  like: number;
  dislike: number;
};
export default function LikeAndDislike({ itemId, like, dislike }: Props) {
  const { data } = useQuery({
    queryKey: ['like', itemId],
    queryFn: () => Batcher.like.get(itemId),
  })

  return (
    <LikeComponent initialLikeCount={like} initialDislikeCount={dislike} itemId={itemId} initialLikeData={data} >
      <LikeButton />
      <DislikeButton />
    </LikeComponent>
  );
}
