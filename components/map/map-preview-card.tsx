'use client';

import Link from 'next/link';
import React from 'react';

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
} from '@/components/common/preview';
import env from '@/constant/env';
import { MapPreview } from '@/types/response/MapPreview';
import { LinkIcon } from '@/components/common/icons';

type MapPreviewCardProps = {
  map: MapPreview;
};

export default function MapPreviewCard({
  map: { id, itemId, name, isVerified, likes, userLike },
}: MapPreviewCardProps) {
  const link = `${env.url.base}/admin/maps/${id}`;
  const detailLink = `/maps/${id}`;
  const imageLink = `${env.url.image}/map-previews/${id}.png`;
  const errorImageLink = `${env.url.api}/maps/${id}/image`;
  const downloadLink = `${env.url.api}/maps/${id}/download`;
  const downloadName = `{${name}}.msch`;

  return (
    <Preview>
      <CopyButton variant="ghost" data={link} content={link}>
        <LinkIcon />
      </CopyButton>
      <Link href={detailLink}>
        <PreviewImage src={imageLink} errorSrc={errorImageLink} alt={name} />
      </Link>
      <PreviewDescription>
        <PreviewHeader>{name}</PreviewHeader>
        <PreviewActions>
          <DownloadButton href={downloadLink} fileName={downloadName} />
          {isVerified && (
            <LikeComponent
              itemId={itemId}
              initialLikeCount={likes}
              initialLikeData={userLike}
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
