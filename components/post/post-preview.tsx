import React, { HTMLAttributes } from 'react';
import { Post } from '@/types/response/Post';
import env from '@/constant/env';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import LikeComponent from '@/components/like/like-component';
import CopyButton from '@/components/button/copy-button';
import IdUserCard from '@/components/user/id-user-card';

type PostPreviewProps = HTMLAttributes<HTMLDivElement> & {
  post: Post;
};

export default function PostPreview({
  className,
  post,
  ...rest
}: PostPreviewProps) {
  const link = `${env.url.base}/posts/${post.id}`;

  return (
    <div
      className={cn(
        'relative flex flex-col rounded-lg border border-border p-4',
        className,
      )}
      {...rest}
    >
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <Link href={`/posts/${post.id}`}>
            <span className="flex text-2xl">{post.header}</span>
          </Link>
          <IdUserCard id={post.authorId} />
        </div>
        <div className="grid w-full grid-cols-[repeat(auto-fit,3rem)] gap-2">
          <CopyButton
            title="Copy"
            variant="outline"
            data={link}
            content={link}
          />
          <LikeComponent
            targetId={post.id}
            targetType="POSTS"
            initialLikeCount={post.like}
            initialLikeData={post.userLike}
          >
            <LikeComponent.LikeButton />
            <LikeComponent.LikeCount />
            <LikeComponent.DislikeButton />
          </LikeComponent>
        </div>
      </div>
    </div>
  );
}
