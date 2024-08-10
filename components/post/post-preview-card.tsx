import Link from 'next/link';
import React, { HTMLAttributes } from 'react';

import CopyButton from '@/components/button/copy-button';
import DislikeButton from '@/components/like/dislike-button';
import LikeButton from '@/components/like/like-button';
import LikeComponent from '@/components/like/like-component';
import LikeCount from '@/components/like/like-count';
import IdUserCard from '@/components/user/id-user-card';
import env from '@/constant/env';
import { cn, getImageById } from '@/lib/utils';
import { Post } from '@/types/response/Post';

import { LinkIcon } from '@heroicons/react/24/outline';

type PostPreviewCardProps = HTMLAttributes<HTMLDivElement> & {
  post: Post;
};

export default function PostPreviewCard({
  className,
  post,
  ...rest
}: PostPreviewCardProps) {
  const link = `${env.url.base}/posts/${post.id}`;
  const firstImage = post.imageUrls ? post.imageUrls[0] : '';

  return (
    <div
      style={{ backgroundImage: `url(${getImageById('posts', firstImage)})` }}
      className={cn(
        'relative flex flex-col rounded-lg border border-border bg-cover bg-center',
        className,
      )}
      {...rest}
    >
      <div className="flex h-full flex-col justify-between gap-2 p-4 backdrop-brightness-50">
        <Link href={`/posts/${post.id}`}>
          <span className="flex text-2xl">{post.title}</span>
        </Link>
        <div className="flex flex-col gap-2">
          <div>
            <IdUserCard id={post.userId} />
            <span>{new Date(post.createdAt).toLocaleString()}</span>
          </div>
          <div className="grid w-full grid-cols-[repeat(auto-fit,3rem)] gap-2">
            <CopyButton data={link} content={link}>
              <LinkIcon className="size-5" />
            </CopyButton>
            {post.isVerified && (
              <LikeComponent
                itemId={post.itemId}
                initialLikeCount={post.likes}
                initialLikeData={post.userLike}
              >
                <LikeButton />
                <LikeCount />
                <DislikeButton />
              </LikeComponent>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
