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
import useClientApi from '@/hooks/use-client';
import useToastAction from '@/hooks/use-toast-action';
import { useI18n } from '@/locales/client';
import { Schematic } from '@/types/response/Schematic';
import { LinkIcon } from '@/components/common/icons';
import { getSchematicData } from '@/query/schematic';

type SchematicPreviewCardProps = {
  schematic: Schematic;
};

export default function SchematicPreviewCard({
  schematic: { id, itemId, name, isVerified, likes, userLike },
}: SchematicPreviewCardProps) {
  const t = useI18n();
  const axios = useClientApi();

  const link = `${env.url.base}/admin/schematics/${id}`;
  const detailLink = `/schematics/${id}`;
  const imageLink = `${env.url.image}/schematic-previews/${id}.png`;
  const errorImageLink = `${env.url.api}/schematics/${id}/image`;
  const copyContent = `Copied schematic ${name}`;
  const downloadLink = `${env.url.api}/schematics/${id}/download`;
  const downloadName = `{${name}}.msch`;

  const getData = useToastAction({
    title: t('copying'),
    content: t('downloading-data'),
    action: async () => await getSchematicData(axios, id),
  });

  return (
    <Preview>
      <CopyButton
        position="absolute"
        variant="ghost"
        data={link}
        content={link}
      >
        <LinkIcon />
      </CopyButton>
      <Link href={detailLink}>
        <PreviewImage src={imageLink} errorSrc={errorImageLink} alt={name} />
      </Link>
      <PreviewDescription>
        <PreviewHeader>{name}</PreviewHeader>
        <PreviewActions>
          <CopyButton content={copyContent} data={getData} />
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
