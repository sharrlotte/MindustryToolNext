import CopyButton from '@/components/button/copy-button';
import DislikeButton from '@/components/like/dislike-button';
import LikeButton from '@/components/like/like-button';
import LikeComponent from '@/components/like/like-component';
import LikeCount from '@/components/like/like-count';
import IdUserCard from '@/components/user/id-user-card';
import env from '@/constant/env';
import { cn } from '@/lib/utils';
import { Post } from '@/types/response/Post';

import { LinkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import React, { HTMLAttributes } from 'react';

type PostPreviewCardProps = HTMLAttributes<HTMLDivElement> & {
  post: Post;
};

export default function PostPreviewCard({
  className,
  post,
  ...rest
}: PostPreviewCardProps) {
  const link = `${env.url.base}/posts/${post.id}`;

  return (
    <div
      className={cn(
        'relative flex flex-col rounded-lg border border-border p-4',
        className,
      )}
      {...rest}
    >
      <div className="flex h-full flex-col justify-between gap-2">
        <Link href={`/posts/${post.id}`}>
          <span className="flex text-2xl">{post.header}</span>
        </Link>
        <div className="flex flex-col gap-2">
          <div>
            <IdUserCard id={post.authorId} />
            <span>{new Date(post.createdAt).toLocaleString()}</span>
          </div>
          <div className="grid w-full grid-cols-[repeat(auto-fit,3rem)] gap-2">
            <CopyButton
              className="border border-border "
              variant="outline"
              data={link}
              content={link}
            >
              <LinkIcon className="h-5 w-5" />
            </CopyButton>
            {post.status === 'VERIFIED' && (
              <LikeComponent
                targetId={post.id}
                targetType="POSTS"
                initialLikeCount={post.like}
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
