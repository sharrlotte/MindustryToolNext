'use client';

import Detail from '@/components/detail/detail';
import LikeComponent from '@/components/like/like-component';
import BackButton from '@/components/ui/back-button';
import CopyButton from '@/components/button/copy-button';
import env from '@/constant/env';
import React from 'react';
import DownloadButton from '@/components/button/download-button';
import IdUserCard from '@/components/user/id-user-card';
import { MapDetail } from '@/types/response/MapDetail';
import LikeButton from '@/components/like/like-button';
import LikeCount from '@/components/like/like-count';
import DislikeButton from '@/components/like/dislike-button';

type MapDetailCardProps = {
  map: MapDetail;
  padding?: boolean;
};

export default function MapDetailCard({ map, padding }: MapDetailCardProps) {
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
        <div className="grid w-full grid-cols-[repeat(auto-fit,3rem)] gap-2">
          <DownloadButton href={`${env.url.api}/maps/${map.id}/download`} />
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
        </div>
        <BackButton />
      </Detail.Actions>
    </Detail>
  );
}
