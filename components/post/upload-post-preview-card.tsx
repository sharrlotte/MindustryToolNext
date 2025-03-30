import React, { HTMLAttributes } from 'react';

import InternalLink from '@/components/common/internal-link';
import IdUserCard from '@/components/user/id-user-card';

import { cn, getImageById } from '@/lib/utils';
import { Post } from '@/types/response/Post';

type UploadPostPreviewCardProps = HTMLAttributes<HTMLDivElement> & {
  post: Post;
};

function UploadPostPreviewCard({ className, post, ...rest }: UploadPostPreviewCardProps) {
  const firstImage = post.imageUrls ? post.imageUrls[0] : '';
  const { id, title, userId, createdAt } = post;

  return (
    <div style={{ backgroundImage: `url(${getImageById('posts', firstImage)})` }} className={cn('h-[212px] relative flex flex-col rounded-lg border border-border', className)} {...rest}>
      <div className="flex h-full flex-col justify-between gap-2 p-4 backdrop-brightness-50">
        <InternalLink href={`/admin/posts/${id}`}>
          <p className="text-2xl w-full text-ellipsis overflow-hidden line-clamp-2">{title}</p>
        </InternalLink>
        <div className="flex flex-col gap-2">
          <div>
            <IdUserCard id={userId} />
            <span className="text-muted-foreground">{new Date(createdAt).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadPostPreviewCard;
