import Detail from '@/components/detail/detail';
import LikeComponent from '@/components/like/like-component';
import TagCard from '@/components/tag/tag-card';
import BackButton from '@/components/ui/back-button';
import CopyButton from '@/components/ui/copy-button';
import env from '@/constant/env';
import { toast } from '@/hooks/use-toast';
import Schematic from '@/types/response/Schematic';
import { Tags } from '@/types/data/Tag';
import React, { HTMLAttributes } from 'react';
import DownloadButton from '@/components/ui/download-button';
import IdUserCard from '@/components/user/id-user-card';
import useClient from '@/hooks/use-client';

type SchematicDetailProps = HTMLAttributes<HTMLDivElement> & {
  schematic: Schematic;
};

export default function SchematicDetail({ schematic }: SchematicDetailProps) {
  const { axiosClient } = useClient();

  const tags = Tags.parseStringArray(schematic.tags);
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
    <Detail>
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
        <Detail.Description>
          <Detail.Header>{schematic.name}</Detail.Header>
          <IdUserCard id={schematic.authorId} />
          <p>{schematic.description}</p>
          <section className="flex flex-wrap gap-1">
            {tags.map((item, index) => (
              <TagCard key={index} tag={item} />
            ))}
          </section>
        </Detail.Description>
      </Detail.Info>
      <Detail.Actions className="flex justify-between">
        <div className="flex gap-1">
          <CopyButton
            title="Copy"
            variant="outline"
            content={`Copied schematic ${schematic.name}`}
            data={getSchematicData}
          />
          <DownloadButton
            className="aspect-square"
            href={`${env.url.api}/schematics/${schematic.id}/download`}
          />
          <LikeComponent
            initialLikeCount={schematic.like}
            initialLikeData={schematic.userLike}
          >
            <LikeComponent.LikeButton
              className="aspect-square"
              size="icon"
              variant="outline"
              title="Like"
            />
            <LikeComponent.LikeCount
              className="aspect-square text-xl"
              size="icon"
              variant="outline"
              title="Like count"
            />
            <LikeComponent.DislikeButton
              className="aspect-square"
              size="icon"
              variant="outline"
              title="Dislike"
            />
          </LikeComponent>
        </div>
        <BackButton />
      </Detail.Actions>
    </Detail>
  );
}
