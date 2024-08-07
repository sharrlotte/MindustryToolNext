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
} from '@/components/preview/preview';
import env from '@/constant/env';
import useClientAPI from '@/hooks/use-client';
import useToastAction from '@/hooks/use-toast-action';
import { useI18n } from '@/locales/client';
import getSchematicData from '@/query/schematic/get-schematic-data';
import { Schematic } from '@/types/response/Schematic';

import { LinkIcon } from '@heroicons/react/24/outline';

type SchematicPreviewCardProps = {
  schematic: Schematic;
};

export default function SchematicPreviewCard({
  schematic: { id, itemId, name, isVerified, likes, userLike },
}: SchematicPreviewCardProps) {
  const t = useI18n();
  const axios = useClientAPI();

  const link = `${env.url.base}/schematics/${id}`;

  const getData = useToastAction({
    title: t('copying'),
    content: t('downloading-data'),
    action: async () => await getSchematicData(axios, id),
  });

  return (
    <Preview>
      <CopyButton variant="ghost" data={link} content={link}>
        <LinkIcon className="h-5 w-5" />
      </CopyButton>
      <Link href={`/schematics/${id}`}>
        <PreviewImage
          src={`${env.url.image}/schematic-previews/${id}.png`}
          errorSrc={`${env.url.api}/schematics/${id}/image`}
          alt={name}
        />
      </Link>
      <PreviewDescription>
        <PreviewHeader>{name}</PreviewHeader>
        <PreviewActions>
          <CopyButton content={`Copied schematic ${name}`} data={getData} />
          <DownloadButton
            href={`${env.url.api}/schematics/${id}/download`}
            fileName={`{${name}}.msch`}
          />
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
