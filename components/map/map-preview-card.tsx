import React, { HTMLAttributes } from 'react';

import CopyButton from '@/components/button/copy-button';
import DislikeButton from '@/components/like/dislike-button';
import DownloadButton from '@/components/button/download-button';
import LikeButton from '@/components/like/like-button';
import LikeComponent from '@/components/like/like-component';
import LikeCount from '@/components/like/like-count';
import Link from 'next/link';
import { Map } from '@/types/response/Map';
import Preview from '@/components/preview/preview';
import { cn } from '@/lib/utils';
import env from '@/constant/env';

type MapPreviewProps = HTMLAttributes<HTMLDivElement> & {
  map: Map;
};

export default function MapPreview({
  className,
  map,
  ...rest
}: MapPreviewProps) {
  const link = `${env.url.base}/maps/${map.id}`;

  return (
    <Preview
      className={cn('group relative flex flex-col justify-between', className)}
      {...rest}
    >
      <CopyButton
        className="absolute left-1 top-1 aspect-square transition-opacity duration-500 group-hover:opacity-100 md:opacity-0"
        variant="ghost"
        data={link}
        content={link}
      />
      <Link className="h-full w-full" href={`/maps/${map.id}`}>
        <Preview.Image
          src={`${env.url.image}/maps/${map.id}.png`}
          errorSrc={`${env.url.api}/maps/${map.id}/image`}
          alt={map.name}
        />
      </Link>
      <Preview.Description>
        <Preview.Header className="h-12">{map.name}</Preview.Header>
        <Preview.Actions>
          <DownloadButton
            href={`${env.url.api}/maps/${map.id}/download`}
            fileName={`{${map.name}}.msav`}
          />
          {map.status === 'VERIFIED' && (
            <LikeComponent
              targetId={map.id}
              targetType="MAPS"
              initialLikeCount={map.like}
              initialLikeData={map.userLike}
            >
              <LikeButton />
              <LikeCount />
              <DislikeButton />
            </LikeComponent>
          )}
        </Preview.Actions>
      </Preview.Description>
    </Preview>
  );
}
