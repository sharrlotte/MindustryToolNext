'use client';

import React, { useEffect, useState } from 'react';

import CopyButton from '@/components/button/copy-button';
import DownloadButton from '@/components/button/download-button';
import { Detail, DetailActions, DetailDescription, DetailHeader, DetailImage, DetailInfo, DetailTitle } from '@/components/common/detail';
import ItemRequirementCard from '@/components/schematic/item-requirement-card';
import TagSelector from '@/components/search/tag-selector';
import IdUserCard from '@/components/user/id-user-card';
import env from '@/constant/env';
import useClientApi from '@/hooks/use-client';
import { useUploadTags } from '@/hooks/use-tags';
import useToastAction from '@/hooks/use-toast-action';
import { useI18n } from '@/i18n/client';
import { SchematicDetail } from '@/types/response/SchematicDetail';
import TagGroup, { TagGroups } from '@/types/response/TagGroup';
import { DeleteSchematicButton } from '@/components/schematic/delete-schematic-button';
import VerifySchematicButton from '@/components/schematic/verify-schematic-button';
import { LinkIcon } from '@/components/common/icons';
import { getSchematicData } from '@/query/schematic';

type UploadSchematicDetailCardProps = {
  schematic: SchematicDetail;
};

export default function UploadSchematicDetailCard({ schematic: { id, name, tags, requirements, description, userId, width, height } }: UploadSchematicDetailCardProps) {
  const axios = useClientApi();
  const { schematic } = useUploadTags();
  const [selectedTags, setSelectedTags] = useState<TagGroup[]>([]);

  const t = useI18n();

  useEffect(() => {
    setSelectedTags(TagGroups.parseString(tags, schematic));
  }, [tags, schematic]);

  const link = `${env.url.base}/schematics/${id}`;
  const imageUrl = `${env.url.image}/schematics/${id}${env.imageFormat}`;
  const errorImageUrl = `${env.url.api}/schematics/${id}/image`;
  const copyMessage = `Copied schematic ${name}`;
  const downloadUrl = `${env.url.api}/schematics/${id}/download`;
  const downloadName = `{${name}}.msch`;

  const getData = useToastAction({
    title: t('copying'),
    content: t('downloading-data'),
    action: async () => await getSchematicData(axios, id),
  });

  return (
    <Detail>
      <DetailInfo>
        <CopyButton position="absolute" variant="ghost" data={link} content={link}>
          <LinkIcon />
        </CopyButton>
        <DetailImage src={imageUrl} errorSrc={errorImageUrl} alt={name} />
        <DetailHeader>
          <DetailTitle>{name}</DetailTitle>
          <IdUserCard id={userId} />
          <span>
            {width}x{height}
          </span>
          <DetailDescription>{description}</DetailDescription>
          <ItemRequirementCard requirements={requirements} />
          <TagSelector tags={schematic} value={selectedTags} onChange={setSelectedTags} />
        </DetailHeader>
      </DetailInfo>
      <DetailActions>
        <CopyButton content={copyMessage} data={getData} />
        <DownloadButton href={downloadUrl} fileName={downloadName} />
        <DeleteSchematicButton id={id} name={name} />
        <VerifySchematicButton id={id} name={name} selectedTags={selectedTags} />
      </DetailActions>
    </Detail>
  );
}
