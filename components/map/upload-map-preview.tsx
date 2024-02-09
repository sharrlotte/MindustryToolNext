import React, { HTMLAttributes } from 'react';
import Preview from '@/components/preview/preview';
import { Map } from '@/types/response/Map';
import env from '@/constant/env';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import CopyButton from '@/components/button/copy-button';
import DownloadButton from '@/components/button/download-button';

type UploadMapPreviewProps = HTMLAttributes<HTMLDivElement> & {
  map: Map;
};

export default function UploadMapPreview({
  className,
  map,
  ...rest
}: UploadMapPreviewProps) {
  const link = `${env.url.base}/admin/maps/${map.id}`;

  return (
    <Preview
      className={cn('group relative flex flex-col', className)}
      {...rest}
    >
      <CopyButton
        className="absolute left-1 top-1 aspect-square transition-opacity duration-500 group-hover:opacity-100 md:opacity-0"
        title="Copy"
        variant="ghost"
        data={link}
        content={link}
      />
      <Link href={`/admin/maps/${map.id}`}>
        <Preview.Image
          src={`${env.url.image}/maps/${map.id}.png`}
          errorSrc={`${env.url.api}/maps/${map.id}/image`}
          alt={map.name}
        />
      </Link>
      <Preview.Description>
        <Preview.Header className="h-12">{map.name}</Preview.Header>
        <Preview.Actions>
          <DownloadButton href={`${env.url.api}/maps/${map.id}/download`} />
        </Preview.Actions>
      </Preview.Description>
    </Preview>
  );
}
