import React, { HTMLAttributes } from 'react';
import Preview from '@/components/preview/preview';
import Map from '@/types/response/Map';
import env from '@/constant/env';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import LikeComponent from '@/components/like/like-component';
import CopyButton from '@/components/ui/copy-button';
import DownloadButton from '@/components/ui/download-button';

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
      className={cn('group relative flex flex-col', className)}
      {...rest}
    >
      <CopyButton
        className="absolute left-1 top-1 aspect-square md:opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        title="Copy"
        variant="ghost"
        data={link}
        content={link}
      />
      <Link href={`/maps/${map.id}`}>
        <Preview.Image
          className="h-preview w-preview"
          src={`${env.url.image}/maps/${map.id}.png`}
          errorSrc={`${env.url.api}/maps/${map.id}/image`}
          alt={map.name}
        />
      </Link>
      <Preview.Description>
        <Preview.Header className="h-12">{map.name}</Preview.Header>
        <Preview.Actions>
          <DownloadButton href={`${env.url.api}/maps/${map.id}/download`} />
          <LikeComponent
            initialLikeCount={map.like}
            initialLikeData={map.userLike}
          >
            <LikeComponent.LikeButton variant="outline" title="Like" />
            <LikeComponent.LikeCount
              className="text-xl"
              variant="outline"
              title="Like count"
            />
            <LikeComponent.DislikeButton variant="outline" title="Dislike" />
          </LikeComponent>
        </Preview.Actions>
      </Preview.Description>
    </Preview>
  );
}
