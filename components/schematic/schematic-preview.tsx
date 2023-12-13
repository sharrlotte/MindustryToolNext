import React, { HTMLAttributes } from 'react';
import Preview from '@/components/preview/preview';
import Schematic from '@/types/response/Schematic';
import env from '@/constant/env';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import LikeComponent from '@/components/like/like-component';
import { toast } from '@/hooks/use-toast';
import CopyButton from '@/components/ui/copy-button';
import axiosClient from '@/query/config/axios-config';
import DownloadButton from '@/components/ui/download-button';

type SchematicPreviewProps = HTMLAttributes<HTMLDivElement> & {
  schematic: Schematic;
};

export default function SchematicPreview({
  className,
  schematic,
  ...rest
}: SchematicPreviewProps) {
  const link = `${env.url.base}/schematics/${schematic.id}`;

  const getSchematicData = async () => {
    const { dismiss } = toast({
      title: 'Coping',
      content: 'Downloading data from server',
    });
    const result = await axiosClient.get(`/schematics/${schematic.id}/data`);
    dismiss();
    return result.data as Promise<string>;
  };

  return (
    <Preview
      className={cn('group relative flex flex-col', className)}
      {...rest}
    >
      <CopyButton
        className="absolute left-1 top-1 opacity-0 transition-opacity duration-500 group-hover:opacity-100 aspect-square"
        title="Copy"
        variant="ghost"
        data={link}
        content={link}
      />
      <Link href={`/schematics/${schematic.id}`}>
        <Preview.Image
          className="h-preview w-preview"
          src={`${env.url.api}/schematics/${schematic.id}/image`}
          alt={schematic.name}
        />
      </Link>
      <Preview.Description>
        <Preview.Header className="h-12">{schematic.name}</Preview.Header>
        <Preview.Actions>
          <CopyButton
            title="Copied"
            variant="outline"
            content={`Copied schematic ${schematic.name}`}
            data={getSchematicData}
          />
          <DownloadButton
            href={`${env.url.api}/schematics/${schematic.id}/download`}
          />
          <LikeComponent
            initialLikeCount={schematic.like}
            initialLikeData={schematic.userLike}
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
