import React, { HTMLAttributes } from 'react';

import IdUserCard from '@/components/user/id-user-card';
import { cn, getImageById } from '@/lib/utils';

import { Post } from '@/types/response/Post';
import InternalLink from '@/components/common/internal-link';

type UploadPostPreviewCardProps = HTMLAttributes<HTMLDivElement> & {
  post: Post;
};

function InternalUploadPostPreviewCard({
  className,
  post,
  ...rest
}: UploadPostPreviewCardProps) {
  const firstImage = post.imageUrls ? post.imageUrls[0] : '';
  const { id, title, userId, createdAt } = post;

  return (
    <div
      style={{ backgroundImage: `url(${getImageById('posts', firstImage)})` }}
      className={cn(
        'relative flex flex-col rounded-lg border border-border',
        className,
      )}
      {...rest}
    >
      <div className="flex h-full flex-col justify-between gap-2 p-4 backdrop-brightness-50">
        <InternalLink href={`/admin/posts/${id}`}>
          <span className="flex text-2xl">{title}</span>
        </InternalLink>
        <div className="flex flex-col gap-2">
          <div>
            <IdUserCard id={userId} />
            <span>{new Date(createdAt).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const UploadPostPreviewCard = React.memo(InternalUploadPostPreviewCard);

export default UploadPostPreviewCard;
