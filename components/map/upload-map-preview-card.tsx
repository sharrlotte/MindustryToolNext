import React, { HTMLAttributes } from 'react';

import CopyButton from '@/components/button/copy-button';
import DownloadButton from '@/components/button/download-button';
import Link from 'next/link';
import { Map } from '@/types/response/Map';
import Preview from '@/components/preview/preview';
import { cn } from '@/lib/utils';
import env from '@/constant/env';
import { LinkIcon } from '@heroicons/react/24/outline';

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
    <Preview className={cn('group relative', className)} {...rest}>
      <CopyButton
        className="absolute left-1 top-1 aspect-square transition-opacity duration-500 group-hover:opacity-100 md:opacity-0"
        variant="ghost"
        data={link}
        content={link}
      >
        <LinkIcon className="h-5 w-5" />
      </CopyButton>
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
          <DownloadButton
            href={`${env.url.api}/maps/${map.id}/download`}
            fileName={`{${map.name}}.msav`}
          />
        </Preview.Actions>
      </Preview.Description>
    </Preview>
  );
}
