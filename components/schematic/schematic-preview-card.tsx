'use client';

import React from 'react';

import CopyButton from '@/components/button/copy-button';
import DownloadButton from '@/components/button/download-button';
import ColorText from '@/components/common/color-text';
import { LinkIcon } from '@/components/common/icons';
import InternalLink from '@/components/common/internal-link';
import { Preview, PreviewActions, PreviewDescription, PreviewHeader, PreviewImage } from '@/components/common/preview';
import Tran from '@/components/common/tran';
import AloneDislikeCount from '@/components/like/alone-dislike-count';
import AloneLikeCount from '@/components/like/alone-like-count';
import LikeComponent from '@/components/like/like-component';

import env from '@/constant/env';
import useClientApi from '@/hooks/use-client';
import useImageLoading from '@/hooks/use-image-loading';
import useToastAction from '@/hooks/use-toast-action';
import { getSchematicData } from '@/query/schematic';
import { Schematic } from '@/types/response/Schematic';

type SchematicPreviewCardProps = {
  schematic: Schematic;
  imageCount: number;
};

function InternalSchematicPreviewCard({ schematic: { id, name, itemId, likes, dislikes, downloadCount }, imageCount }: SchematicPreviewCardProps) {
  const axios = useClientApi();

  const link = `${env.url.base}/schematics/${id}`;
  const detailLink = `/schematics/${id}`;
  const imageLink = `${env.url.image}/schematic-previews/${id}${env.imageFormat}`;
  const detailImageLink = `${env.url.image}/schematics/${id}${env.imageFormat}`;
  const errorImageLink = `${env.url.api}/schematics/${id}/image`;
  const copyContent = `Copied schematic ${name}`;
  const downloadLink = `${env.url.api}/schematics/${id}/download`;
  const downloadName = `{${name}}.msch`;

  const getData = useToastAction({
    title: <Tran text="copying" />,
    content: <Tran text="downloading-data" />,
    action: async () => await getSchematicData(axios, id),
  });

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
          <CopyButton content={copyContent} data={getData} />
          <DownloadButton count={downloadCount} href={downloadLink} fileName={downloadName} />
          <LikeComponent itemId={itemId} initialLikeCount={likes} initialDislikeCount={dislikes}>
            <AloneLikeCount />
            <AloneDislikeCount />
          </LikeComponent>
        </PreviewActions>
      </PreviewDescription>
    </Preview>
  );
}

const SchematicPreviewCard = React.memo(InternalSchematicPreviewCard);

export default SchematicPreviewCard;
