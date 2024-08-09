import CopyButton from '@/components/button/copy-button';
import DownloadButton from '@/components/button/download-button';
import { LinkIcon } from '@/components/common/icons';
import {
  Preview,
  PreviewActions,
  PreviewDescription,
  PreviewHeader,
  PreviewImage,
} from '@/components/preview/preview';
import env from '@/constant/env';
import { MapPreview } from '@/types/response/MapPreview';

import Link from 'next/link';
import React from 'react';

type UploadMapPreviewCardProps = {
  map: MapPreview;
};

export default function UploadMapPreviewCard({
  map: { id, name },
}: UploadMapPreviewCardProps) {
  const link = `${env.url.base}/admin/maps/${id}`;
  const detailLink = `/admin/maps/${id}`;
  const imageLink = `${env.url.image}/map-previews/${id}.png`;
  const errorImageLink = `${env.url.api}/maps/${id}/image`;
  const downloadLink = `${env.url.api}/maps/${id}/download`;
  const downloadName = `{${name}}.msav`;

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
        </PreviewActions>
      </PreviewDescription>
    </Preview>
  );
}
