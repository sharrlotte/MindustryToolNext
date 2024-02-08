'use client';

import Detail from '@/components/detail/detail';
import LikeComponent from '@/components/like/like-component';
import BackButton from '@/components/ui/back-button';
import CopyButton from '@/components/button/copy-button';
import env from '@/constant/env';
import { Map } from '@/types/response/Map';
import React from 'react';
import DownloadButton from '@/components/button/download-button';
import IdUserCard from '@/components/user/id-user-card';

type MapDetailProps = {
  map: Map;
  padding?: boolean;
};

export default function MapDetail({ map, padding }: MapDetailProps) {
  const link = `${env.url.base}/maps/${map.id}`;

  return (
    <Detail padding={padding}>
      <Detail.Info>
        <div className="relative">
          <CopyButton
            className="absolute left-1 top-1 "
            title="Copy"
            variant="ghost"
            data={link}
            content={link}
          />
          <Detail.Image
            src={`${env.url.image}/maps/${map.id}.png`}
            errorSrc={`${env.url.api}/maps/${map.id}/image`}
            alt={map.name}
          />
        </div>
        <Detail.Header>
          <Detail.Title>{map.name}</Detail.Title>
          <IdUserCard id={map.authorId} />
          <div className="flex items-end gap-2">
            <span>Verified by</span>
            <IdUserCard id={map.verifyAdmin} />
          </div>
          <Detail.Description>{map.description}</Detail.Description>
          <Detail.Tags tags={map.tags} />
        </Detail.Header>
      </Detail.Info>
      <Detail.Actions className="flex justify-between">
        <div className="flex gap-1">
          <DownloadButton
            className="aspect-square"
            href={`${env.url.api}/maps/${map.id}/download`}
          />
          <LikeComponent
            targetId={map.id}
            targetType="MAPS"
            initialLikeCount={map.like}
            initialLikeData={map.userLike}
          >
            <LikeComponent.LikeButton />
            <LikeComponent.LikeCount />
            <LikeComponent.DislikeButton />
          </LikeComponent>
        </div>
        <BackButton />
      </Detail.Actions>
    </Detail>
  );
}
