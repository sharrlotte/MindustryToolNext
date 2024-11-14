import React from 'react';

import CopyButton from '@/components/button/copy-button';
import DownloadButton from '@/components/button/download-button';
import { Preview, PreviewActions, PreviewDescription, PreviewHeader, PreviewImage } from '@/components/common/preview';
import env from '@/constant/env';
import { Map } from '@/types/response/Map';
import { LinkIcon } from '@/components/common/icons';
import { BulkActionSelector } from '@/components/common/bulk-action';
import ColorText from '@/components/common/color-text';
import InternalLink from '@/components/common/internal-link';
import useImageLoading from '@/hooks/use-image-loading';

type UploadMapPreviewCardProps = {
  map: Map;
  imageCount: number;
};

function InternalUploadMapPreviewCard({ map: { id, name }, imageCount }: UploadMapPreviewCardProps) {
  const link = `${env.url.base}/admin/maps/${id}`;
  const detailLink = `/admin/maps/${id}`;
  const imageLink = `${env.url.image}/map-previews/${id}${env.imageFormat}`;
  const detailImageLink = `${env.url.image}/maps/${id}${env.imageFormat}`;
  const errorImageLink = `${env.url.api}/maps/${id}/image`;
  const downloadLink = `${env.url.api}/maps/${id}/download`;
  const downloadName = `{${name}}.msch`;

  const loading = useImageLoading(imageCount);

  return (
    <Preview>
      <CopyButton position="absolute" variant="ghost" data={link} content={link}>
        <LinkIcon />
      </CopyButton>
      <BulkActionSelector value={id} />
      <InternalLink href={detailLink} preloadImage={detailImageLink}>
        <PreviewImage src={imageLink} errorSrc={errorImageLink} alt={name} loading={loading} />
      </InternalLink>
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

const UploadMapPreviewCard = React.memo(InternalUploadMapPreviewCard);

export default UploadMapPreviewCard;
