'use client';

import React from 'react';

import CopyButton from '@/components/button/copy-button';
import DownloadButton from '@/components/button/download-button';
import ColorText from '@/components/common/color-text';
import { LinkIcon } from '@/components/common/icons';
import InternalLink from '@/components/common/internal-link';
import { Preview, PreviewActions, PreviewDescription, PreviewHeader, PreviewImage } from '@/components/common/preview';
import AloneDislikeCount from '@/components/like/alone-dislike-count';
import AloneLikeCount from '@/components/like/alone-like-count';
import LikeComponent from '@/components/like/like-component';

import env from '@/constant/env';
import useImageLoading from '@/hooks/use-image-loading';
import { Map } from '@/types/response/Map';
import { useParams } from 'next/navigation';

type MapPreviewCardProps = {
  map: Map;
  imageCount: number;
};

function MapPreviewCard({ map: { id, itemId, name, isVerified, likes, dislikes, downloadCount }, imageCount }: MapPreviewCardProps) {
  const { locale } = useParams();

  const link = `${env.url.base}/${locale}/maps/${id}`;
  const detailLink = `/maps/${id}`;
  const imageLink = `${env.url.image}/map-previews/${id}${env.imageFormat}`;
  const detailImageLink = `${env.url.image}/maps/${id}${env.imageFormat}`;
  const errorImageLink = `${env.url.api}/maps/${id}/image`;
  const downloadLink = `${env.url.api}/maps/${id}/download`;
  const downloadName = `{${name}}.msav`;

  const loading = useImageLoading(imageCount);

  return (
    <Preview>
      <CopyButton position="absolute" variant="ghost" data={link} content={link}>
        <LinkIcon />
      </CopyButton>
      <InternalLink href={detailLink} preloadImage={detailImageLink}>
        <PreviewImage src={imageLink} errorSrc={errorImageLink} alt={name} loading={loading} />
      </InternalLink>
      <PreviewDescription>
        <PreviewHeader>
          <ColorText text={name} />
        </PreviewHeader>
        <PreviewActions>
          <DownloadButton count={downloadCount} href={downloadLink} fileName={downloadName} />
          {isVerified && (
            <LikeComponent itemId={itemId} initialLikeCount={likes} initialDislikeCount={dislikes}>
              <AloneLikeCount />
              <AloneDislikeCount />
            </LikeComponent>
          )}
        </PreviewActions>
      </PreviewDescription>
    </Preview>
  );
}

export default MapPreviewCard;
