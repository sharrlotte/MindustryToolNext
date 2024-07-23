import Link from 'next/link';
import React, { HTMLAttributes } from 'react';

import CopyButton from '@/components/button/copy-button';
import DownloadButton from '@/components/button/download-button';
import DislikeButton from '@/components/like/dislike-button';
import LikeButton from '@/components/like/like-button';
import LikeComponent from '@/components/like/like-component';
import LikeCount from '@/components/like/like-count';
import {
  Preview,
  PreviewActions,
  PreviewDescription,
  PreviewHeader,
  PreviewImage,
} from '@/components/preview/preview';
import env from '@/constant/env';
import { cn } from '@/lib/utils';
import { Map } from '@/types/response/Map';

import { LinkIcon } from '@heroicons/react/24/outline';

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
      >
        <LinkIcon className="h-5 w-5" />
      </CopyButton>
      <Link className="h-full w-full overflow-hidden" href={`/maps/${map.id}`}>
        <PreviewImage
          src={`${env.url.image}/map-previews/${map.id}.png`}
          errorSrc={`${env.url.api}/maps/${map.id}/image`}
          alt={map.name}
        />
      </Link>
      <PreviewDescription>
        <PreviewHeader className="h-12">{map.name}</PreviewHeader>
        <PreviewActions>
          <DownloadButton
            href={`${env.url.api}/maps/${map.id}/download`}
            fileName={`{${map.name}}.msav`}
          />
          {map.status === 'VERIFIED' && (
            <LikeComponent
              itemId={map.itemId}
              initialLikeCount={map.like}
              initialLikeData={map.userLike}
            >
              <LikeButton />
              <LikeCount />
              <DislikeButton />
            </LikeComponent>
          )}
        </PreviewActions>
      </PreviewDescription>
    </Preview>
  );
}
