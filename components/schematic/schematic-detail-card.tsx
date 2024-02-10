'use client';

import Detail from '@/components/detail/detail';
import LikeComponent from '@/components/like/like-component';
import BackButton from '@/components/ui/back-button';
import CopyButton from '@/components/button/copy-button';
import env from '@/constant/env';
import { toast } from '@/hooks/use-toast';
import { SchematicDetail } from '@/types/response/SchematicDetail';
import React, { HTMLAttributes } from 'react';
import DownloadButton from '@/components/button/download-button';
import IdUserCard from '@/components/user/id-user-card';
import useClientAPI from '@/hooks/use-client';
import ItemRequirementCard from '@/components/schematic/item-requirement-card';
import getSchematicData from '@/query/schematic/get-schematic-data';

type SchematicDetailCardProps = HTMLAttributes<HTMLDivElement> & {
  schematic: SchematicDetail;
  padding?: boolean;
};

export default function SchematicDetailCard({
  schematic,
  padding,
}: SchematicDetailCardProps) {
  const { axios } = useClientAPI();

  const link = `${env.url.base}/schematics/${schematic.id}`;

  const getData = async () => {
    const { dismiss } = toast({
      title: 'Coping',
      content: 'Downloading data from server',
    });
    const result = await getSchematicData(axios, schematic.id);
    dismiss();
    return result;
  };

  return (
    <Detail padding={padding}>
      <Detail.Info>
        <div className="relative">
          <CopyButton
            className="absolute left-1 top-1 "
            title="Copy"
            variant="ghost"
            data={link}
            content={link}
          />
          <Detail.Image
            src={`${env.url.image}/schematics/${schematic.id}.png`}
            errorSrc={`${env.url.api}/schematics/${schematic.id}/image`}
            alt={schematic.name}
          />
        </div>
        <Detail.Header>
          <Detail.Title>{schematic.name}</Detail.Title>
          <IdUserCard id={schematic.authorId} />
          <div className="flex items-end gap-2">
            <span>Verified by</span>
            <IdUserCard id={schematic.verifyAdmin} />
          </div>
          <Detail.Description>{schematic.description}</Detail.Description>
          <ItemRequirementCard requirement={schematic.requirement} />
          <Detail.Tags tags={schematic.tags} />
        </Detail.Header>
      </Detail.Info>
      <Detail.Actions className="flex justify-between">
        <div className="grid w-full grid-cols-[repeat(auto-fit,3rem)] gap-2">
          <CopyButton
            title="Copy"
            variant="outline"
            content={`Copied schematic ${schematic.name}`}
            data={getData}
          />
          <DownloadButton
            href={`${env.url.api}/schematics/${schematic.id}/download`}
          />
          <LikeComponent
            targetId={schematic.id}
            targetType="SCHEMATICS"
            initialLikeCount={schematic.like}
            initialLikeData={schematic.userLike}
          >
            <LikeComponent.LikeButton />
            <LikeComponent.LikeCount />
            <LikeComponent.DislikeButton />
          </LikeComponent>
        </div>
        <BackButton />
      </Detail.Actions>
    </Detail>
  );
}
