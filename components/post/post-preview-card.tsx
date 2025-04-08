import { useParams } from 'next/navigation';
import React, { HTMLAttributes } from 'react';

import CopyButton from '@/components/button/copy-button';
import { ShareIcon } from '@/components/common/icons';
import InternalLink from '@/components/common/internal-link';
import LikeAndDislike from '@/components/like/like-and-dislike';
import IdUserCard from '@/components/user/id-user-card';

import env from '@/constant/env';
import { cn } from '@/lib/utils';
import { Post } from '@/types/response/Post';

type PostPreviewCardProps = HTMLAttributes<HTMLDivElement> & {
  post: Post;
};

function PostPreviewCard({ className, post: { id, imageUrls, title, likes, dislikes, itemId, createdAt, userId }, ...rest }: PostPreviewCardProps) {
  const { locale } = useParams();

  const link = `${env.url.base}/${locale}/posts/${id}`;
  const firstImage = imageUrls ? imageUrls[0] : '';

  return (
    <div className="bg-card overflow-hidden rounded-md h-[212px] relative group">
      <div style={{ backgroundImage: `url(${firstImage})` }} className={cn('relative backdrop-blur-xs backdrop-brightness-75 flex flex-col h-full overflow-hidden rounded-lg text-white bg-cover bg-center', className)} {...rest}>
        <div className="flex h-full flex-col justify-between gap-2 p-4">
          <InternalLink href={`/posts/${id}`}>
            <p className="text-2xl w-full text-ellipsis overflow-hidden line-clamp-2">{title}</p>
          </InternalLink>
          <div className="flex flex-col gap-2">
            <div>
              <IdUserCard id={userId} />
              <span className="text-muted-foreground">{new Date(createdAt).toLocaleString()}</span>
            </div>
            <div className="grid w-full grid-cols-[repeat(auto-fit,4rem)] gap-2">
              <LikeAndDislike like={likes} dislike={dislikes} itemId={itemId} />
              <CopyButton position="absolute-right" variant="ghost" data={link} content={link}>
                <ShareIcon />
              </CopyButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostPreviewCard;
