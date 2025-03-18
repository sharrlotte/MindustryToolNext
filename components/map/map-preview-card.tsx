'use client';

import { useParams } from 'next/navigation';
import React from 'react';

import CopyButton from '@/components/button/copy-button';
import DownloadButton from '@/components/button/download-button';
import ColorText from '@/components/common/color-text';
import { ShareIcon } from '@/components/common/icons';
import InternalLink from '@/components/common/internal-link';
import { Preview, PreviewActions, PreviewDescription, PreviewHeader, PreviewImage } from '@/components/common/preview';
import LikeAndDislike from '@/components/like/like-and-dislike';

import env from '@/constant/env';
import { Map } from '@/types/response/Map';

type MapPreviewCardProps = {
  map: Map;
};

function MapPreviewCard({ map: { id, name, likes, dislikes, downloadCount } }: MapPreviewCardProps) {
  const { locale } = useParams();

  const link = `${env.url.base}/${locale}/maps/${id}`;
  const detailLink = `/maps/${id}`;
  const imageLink = `${env.url.image}/map-previews/${id}${env.imageFormat}`;
  const errorImageLink = `${env.url.api}/maps/${id}/image`;
  const downloadLink = `${env.url.api}/maps/${id}/download`;
  const downloadName = `{${name}}.msav`;

  return (
    <Preview>
      <CopyButton position="absolute" variant="ghost" data={link} content={link}>
        <ShareIcon />
      </CopyButton>
      <InternalLink href={detailLink}>
        <PreviewImage src={imageLink} errorSrc={errorImageLink} alt={name} />
      </InternalLink>
      <PreviewDescription>
        <PreviewHeader>
          <ColorText text={name} />
          <LikeAndDislike like={likes} dislike={dislikes} />
        </PreviewHeader>
        <PreviewActions>
          <DownloadButton count={downloadCount} href={downloadLink} fileName={downloadName} />
        </PreviewActions>
      </PreviewDescription>
    </Preview>
  );
}

export default MapPreviewCard;
