'use client';

import Detail from '@/components/detail/detail';
import BackButton from '@/components/ui/back-button';
import CopyButton from '@/components/button/copy-button';
import env from '@/constant/env';
import { useToast } from '@/hooks/use-toast';
import { Schematic } from '@/types/response/Schematic';
import React, { HTMLAttributes, useState } from 'react';
import DownloadButton from '@/components/button/download-button';
import IdUserCard from '@/components/user/id-user-card';
import useClientAPI from '@/hooks/use-client';
import ItemRequirementCard from '@/components/schematic/item-requirement-card';
import { useMutation } from '@tanstack/react-query';
import postVerifySchematic from '@/query/schematic/post-verify-schematic';
import VerifySchematicRequest from '@/types/request/VerifySchematicRequest';
import getSchematicData from '@/query/schematic/get-schematic-data';
import TagGroup from '@/types/response/TagGroup';
import NameTagSelector from '@/components/search/name-tag-selector';
import useTags from '@/hooks/use-tags';
import { useRouter } from 'next/navigation';
import deleteSchematic from '@/query/schematic/delete-schematic';
import useQueriesData from '@/hooks/use-queries-data';
import VerifyButton from '@/components/button/verify-button';
import DeleteButton from '@/components/button/delete-button';

type UploadSchematicDetailProps = HTMLAttributes<HTMLDivElement> & {
  schematic: Schematic;
};

export default function UploadSchematicDetail({
  schematic,
}: UploadSchematicDetailProps) {
  const { toast } = useToast();
  const { back } = useRouter();
  const { axios } = useClientAPI();
  const [selectedTags, setSelectedTags] = useState<TagGroup[]>([]);
  const { schematic: schematicTags } = useTags();
  const { deleteById, invalidateByKey } = useQueriesData();

  const { mutate: verifySchematic, isPending: isVerifying } = useMutation({
    mutationFn: (data: VerifySchematicRequest) =>
      postVerifySchematic(axios, data),
    onSuccess: () => {
      deleteById(['schematic-uploads'], schematic.id);
      back();
      toast({
        title: 'Verify schematic successfully',
        variant: 'success',
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to verify schematic',
        description: error.message,
        variant: 'destructive',
      });
    },
    onSettled: () => {
      invalidateByKey(['schematic-uploads']);
    },
  });

  const { mutate: deleteSchematicById, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => deleteSchematic(axios, id),
    onSuccess: () => {
      deleteById(['schematic-uploads'], schematic.id);
      invalidateByKey(['schematic-uploads']);
      back();
      toast({
        title: 'Delete schematic successfully',
        variant: 'success',
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to delete schematic',
        description: error.message,
        variant: 'destructive',
      });
    },
    onSettled: () => {
      invalidateByKey(['schematic-uploads']);
    },
  });

  const isLoading = isVerifying || isDeleting;
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
        <Detail.Header>
          <Detail.Title>{schematic.name}</Detail.Title>
          <IdUserCard id={schematic.authorId} />
          <Detail.Description>{schematic.description}</Detail.Description>
          <ItemRequirementCard requirement={schematic.requirement} />
          <NameTagSelector
            tags={schematicTags}
            value={selectedTags}
            onChange={setSelectedTags}
          />
        </Detail.Header>
      </Detail.Info>
      <Detail.Actions className="flex justify-between">
        <div className="flex gap-1">
          <CopyButton
            className="aspect-square h-9 w-9"
            title="Copy"
            variant="outline"
            content={`Copied schematic ${schematic.name}`}
            data={getData}
          />
          <DownloadButton
            className="aspect-square h-9 w-9"
            href={`${env.url.api}/schematics/${schematic.id}/download`}
          />
          <DeleteButton
            description={`Delete this schematic: ${schematic.name}`}
            isLoading={isLoading}
            onClick={() => deleteSchematicById(schematic.id)}
          />
          <VerifyButton
            description={`Verify this schematic: ${schematic.name}`}
            isLoading={isLoading}
            onClick={() =>
              verifySchematic({ id: schematic.id, tags: selectedTags })
            }
          />
        </div>
        <BackButton />
      </Detail.Actions>
    </Detail>
  );
}
