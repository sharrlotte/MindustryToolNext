'use client';

import React, { useEffect, useState } from 'react';

import CopyButton from '@/components/button/copy-button';
import DownloadButton from '@/components/button/download-button';
import {
  Detail,
  DetailActions,
  DetailDescription,
  DetailHeader,
  DetailImage,
  DetailInfo,
  DetailTitle,
} from '@/components/common/detail';
import NameTagSelector from '@/components/search/name-tag-selector';
import IdUserCard from '@/components/user/id-user-card';
import env from '@/constant/env';
import { useUploadTags } from '@/hooks/use-tags';
import { MapDetail } from '@/types/response/MapDetail';
import TagGroup, { TagGroups } from '@/types/response/TagGroup';
import { DeleteMapButton } from '@/components/map/delete-map-button';
import VerifyMapButton from '@/components/map/verify-map-button';
import { LinkIcon } from '@/components/common/icons';

type UploadMapDetailCardProps = {
  map: MapDetail;
};

export default function UploadMapDetailCard({
  map: { id, name, tags, description, userId },
}: UploadMapDetailCardProps) {
  const { map } = useUploadTags();
  const [selectedTags, setSelectedTags] = useState<TagGroup[]>([]);

  useEffect(() => {
    setSelectedTags(TagGroups.parseString(tags, map));
  }, [tags, map]);

  const link = `${env.url.base}/maps/${id}`;
  const imageUrl = `${env.url.image}/maps/${id}.png`;
  const errorImageUrl = `${env.url.api}/maps/${id}/image`;
  const downloadUrl = `${env.url.api}/maps/${id}/download`;
  const downloadName = `{${name}}.msch`;

  return (
    <Detail>
      <DetailInfo>
        <CopyButton
          position="absolute"
          variant="ghost"
          data={link}
          content={link}
        >
          <LinkIcon />
        </CopyButton>
        <DetailImage src={imageUrl} errorSrc={errorImageUrl} alt={name} />
        <DetailHeader>
          <DetailTitle>{name}</DetailTitle>
          <IdUserCard id={userId} />
          <DetailDescription>{description}</DetailDescription>
          <NameTagSelector
            tags={map}
            value={selectedTags}
            onChange={setSelectedTags}
          />
        </DetailHeader>
      </DetailInfo>
      <DetailActions>
        <DownloadButton href={downloadUrl} fileName={downloadName} />
        <DeleteMapButton id={id} name={name} />
        <VerifyMapButton id={id} name={name} selectedTags={selectedTags} />
      </DetailActions>
    </Detail>
  );
}
