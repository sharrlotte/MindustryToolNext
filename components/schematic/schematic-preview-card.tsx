'use client';

import Link from 'next/link';
import React, { HTMLAttributes, memo } from 'react';

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
import { cn } from '@/lib/utils';
import { useI18n } from '@/locales/client';
import getSchematicData from '@/query/schematic/get-schematic-data';
import { Schematic } from '@/types/response/Schematic';

import { LinkIcon } from '@heroicons/react/24/outline';

type SchematicPreviewCardProps = HTMLAttributes<HTMLDivElement> & {
  schematic: Schematic;
};

const SchematicPreviewCard = memo(function SchematicPreviewCard({
  className,
  schematic,
  ...rest
}: SchematicPreviewCardProps) {
  const t = useI18n();
  const axios = useClientAPI();

  const link = `${env.url.base}/schematics/${schematic.id}`;

  const getData = useToastAction({
    title: t('copying'),
    content: t('downloading-data'),
    action: async () => await getSchematicData(axios, schematic.id),
  });

  return (
    <Preview className={cn('group relative', className)} {...rest}>
      <CopyButton
        className="absolute left-1 top-1 aspect-square transition-opacity duration-500 group-hover:opacity-100 md:opacity-0"
        variant="ghost"
        data={link}
        content={link}
      >
        <LinkIcon className="h-5 w-5" />
      </CopyButton>
      <Link
        className="h-full w-full overflow-hidden"
        href={`/schematics/${schematic.id}`}
      >
        <PreviewImage
          src={`${env.url.image}/schematics-previews/${schematic.id}.png`}
          errorSrc={`${env.url.api}/schematics/${schematic.id}/image`}
          alt={schematic.name}
        />
      </Link>
      <PreviewDescription>
        <PreviewHeader className="h-12">{schematic.name}</PreviewHeader>
        <PreviewActions>
          <CopyButton
            className="border border-border "
            variant="outline"
            content={`Copied schematic ${schematic.name}`}
            data={getData}
          />
          <DownloadButton
            href={`${env.url.api}/schematics/${schematic.id}/download`}
            fileName={`{${schematic.name}}.msch`}
          />
          {schematic.status === 'VERIFIED' && (
            <LikeComponent
              targetId={schematic.id}
              targetType="SCHEMATICS"
              initialLikeCount={schematic.like}
              initialLikeData={schematic.userLike}
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
});

export default SchematicPreviewCard;
