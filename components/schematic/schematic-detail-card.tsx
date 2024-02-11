'use client';

import Detail from '@/components/detail/detail';
import LikeComponent from '@/components/like/like-component';
import BackButton from '@/components/ui/back-button';
import CopyButton from '@/components/button/copy-button';
import env from '@/constant/env';
import { useToast } from '@/hooks/use-toast';
import { SchematicDetail } from '@/types/response/SchematicDetail';
import React, { HTMLAttributes } from 'react';
import DownloadButton from '@/components/button/download-button';
import IdUserCard from '@/components/user/id-user-card';
import useClientAPI from '@/hooks/use-client';
import ItemRequirementCard from '@/components/schematic/item-requirement-card';
import getSchematicData from '@/query/schematic/get-schematic-data';
import DislikeButton from '@/components/like/dislike-button';
import LikeButton from '@/components/like/like-button';
import LikeCount from '@/components/like/like-count';
import useQueriesData from '@/hooks/use-queries-data';
import putRemoveSchematic from '@/query/schematic/put-remove-schematic';
import { useMutation } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import ProtectedElement from '@/layout/protected-element';
import TakeDownButton from '@/components/button/take-down-button';
import { useRouter } from 'next/navigation';

type SchematicDetailCardProps = HTMLAttributes<HTMLDivElement> & {
  schematic: SchematicDetail;
  padding?: boolean;
};

export default function SchematicDetailCard({
  schematic,
  padding,
}: SchematicDetailCardProps) {
  const { axios } = useClientAPI();
  const { deleteById, invalidateByKey } = useQueriesData();
  const { back } = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();

  const { mutate: removeSchematic, isPending: isRemoving } = useMutation({
    mutationFn: (id: string) => putRemoveSchematic(axios, id),
    onSuccess: () => {
      deleteById(['schematics'], schematic.id);
      invalidateByKey(['schematic-uploads']);
      back();
      toast({
        title: 'Take down schematic successfully',
        variant: 'success',
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to take down schematic',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

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
            <LikeButton />
            <LikeCount />
            <DislikeButton />
          </LikeComponent>
          <ProtectedElement session={session} ownerId={schematic.authorId}>
            <TakeDownButton
              isLoading={isRemoving}
              description={`Take down this schematic: ${schematic.name}`}
              onClick={() => removeSchematic(schematic.id)}
            />
          </ProtectedElement>
        </div>
        <BackButton />
      </Detail.Actions>
    </Detail>
  );
}
