import IdUserCard from '@/components/user/id-user-card';
import { cn } from '@/lib/utils';
import { Post } from '@/types/response/Post';

import Link from 'next/link';
import React, { HTMLAttributes } from 'react';

type UploadPostPreviewCardProps = HTMLAttributes<HTMLDivElement> & {
  post: Post;
};

export default function UploadPostPreviewCard({
  className,
  post,
  ...rest
}: UploadPostPreviewCardProps) {
  return (
    <div
      className={cn(
        'relative flex flex-col rounded-lg border border-border p-4',
        className,
      )}
      {...rest}
    >
      <div className="flex h-full flex-col justify-between gap-2">
        <Link href={`/admin/posts/${post.id}`}>
          <span className="flex text-2xl">{post.header}</span>
        </Link>
        <div className="flex flex-col gap-2">
          <div>
            <IdUserCard id={post.authorId} />
            <span>{new Date(post.createdAt).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
