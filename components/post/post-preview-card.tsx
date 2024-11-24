import React, { HTMLAttributes } from 'react';

import CopyButton from '@/components/button/copy-button';
import { LinkIcon } from '@/components/common/icons';
import InternalLink from '@/components/common/internal-link';
import IdUserCard from '@/components/user/id-user-card';

import env from '@/constant/env';
import { cn } from '@/lib/utils';
import { Post } from '@/types/response/Post';

type PostPreviewCardProps = HTMLAttributes<HTMLDivElement> & {
  post: Post;
};

function InternalPostPreviewCard({ className, post, ...rest }: PostPreviewCardProps) {
  const link = `${env.url.base}/posts/${post.id}`;
  const firstImage = post.imageUrls ? post.imageUrls[0] : '';

  return (
    <div style={{ backgroundImage: `url(${firstImage})` }} className={cn('relative flex flex-col overflow-hidden rounded-lg border border-border bg-cover bg-center', className)} {...rest}>
      <div className="flex h-full flex-col justify-between gap-2 p-4 backdrop-blur-sm backdrop-brightness-50">
        <InternalLink href={`/posts/${post.id}`}>
          <span className="flex text-2xl">{post.title}</span>
        </InternalLink>
        <div className="flex flex-col gap-2">
          <div>
            <IdUserCard id={post.userId} />
            <span>{new Date(post.createdAt).toLocaleString()}</span>
          </div>
          <div className="grid w-full grid-cols-[repeat(auto-fit,3rem)] gap-2">
            <CopyButton data={link} content={link}>
              <LinkIcon />
            </CopyButton>
          </div>
        </div>
      </div>
    </div>
  );
}

const PostPreviewCard = React.memo(InternalPostPreviewCard);

export default PostPreviewCard;
