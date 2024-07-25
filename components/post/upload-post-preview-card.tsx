import Link from 'next/link';
import React, { HTMLAttributes } from 'react';

import IdUserCard from '@/components/user/id-user-card';
import { cn, getImageById } from '@/lib/utils';
import { Post } from '@/types/response/Post';

type UploadPostPreviewCardProps = HTMLAttributes<HTMLDivElement> & {
  post: Post;
};

export default function UploadPostPreviewCard({
  className,
  post,
  ...rest
}: UploadPostPreviewCardProps) {
  const firstImage = post.imageUrls ? post.imageUrls[0] : '';

  return (
    <div
      style={{ backgroundImage: `url(${getImageById('posts', firstImage)})` }}
      className={cn(
        'relative flex flex-col rounded-lg border border-border',
        className,
      )}
      {...rest}
    >
      <div className="flex h-full flex-col justify-between gap-2 backdrop-brightness-50 p-4">
        <Link href={`/admin/posts/${post.id}`}>
          <span className="flex text-2xl">{post.title}</span>
        </Link>
        <div className="flex flex-col gap-2">
          <div>
            <IdUserCard id={post.userId} />
            <span>{new Date(post.createdAt).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
