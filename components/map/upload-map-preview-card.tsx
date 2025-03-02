import { useParams } from 'next/navigation';
import React from 'react';

import CopyButton from '@/components/button/copy-button';
import DownloadButton from '@/components/button/download-button';
import { BulkActionSelector } from '@/components/common/bulk-action';
import ColorText from '@/components/common/color-text';
import { ShareIcon } from '@/components/common/icons';
import InternalLink from '@/components/common/internal-link';
import { Preview, PreviewActions, PreviewDescription, PreviewHeader, PreviewImage } from '@/components/common/preview';

import env from '@/constant/env';
import { Map } from '@/types/response/Map';

type UploadMapPreviewCardProps = {
  map: Map;
};

function UploadMapPreviewCard({ map: { id, name } }: UploadMapPreviewCardProps) {
  const { locale } = useParams();

  const link = `${env.url.base}/${locale}/admin/maps/${id}`;
  const detailLink = `/admin/maps/${id}`;
  const imageLink = `${env.url.image}/map-previews/${id}${env.imageFormat}`;
  const errorImageLink = `${env.url.api}/maps/${id}/image`;
  const downloadLink = `${env.url.api}/maps/${id}/download`;
  const downloadName = `{${name}}.msch`;

  return (
    <Preview>
      <CopyButton position="absolute" variant="ghost" data={link} content={link}>
        <ShareIcon />
      </CopyButton>
      <BulkActionSelector value={id}>
        <InternalLink href={detailLink}>
          <PreviewImage src={imageLink} errorSrc={errorImageLink} alt={name} />
        </InternalLink>
      </BulkActionSelector>
      <PreviewDescription>
        <PreviewHeader>
          <ColorText text={name} />
        </PreviewHeader>
        <PreviewActions>
          <DownloadButton href={downloadLink} fileName={downloadName} />
        </PreviewActions>
      </PreviewDescription>
    </Preview>
  );
}

export default UploadMapPreviewCard;
