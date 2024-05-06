'use client';

import Detail from '@/components/detail/detail';
import BackButton from '@/components/ui/back-button';
import CopyButton from '@/components/button/copy-button';
import env from '@/constant/env';
import { useToast } from '@/hooks/use-toast';
import { SchematicDetail } from '@/types/response/SchematicDetail';
import React, { HTMLAttributes, useEffect, useState } from 'react';
import DownloadButton from '@/components/button/download-button';
import IdUserCard from '@/components/user/id-user-card';
import useClientAPI from '@/hooks/use-client';
import ItemRequirementCard from '@/components/schematic/item-requirement-card';
import { useMutation } from '@tanstack/react-query';
import postVerifySchematic from '@/query/schematic/post-verify-schematic';
import VerifySchematicRequest from '@/types/request/VerifySchematicRequest';
import getSchematicData from '@/query/schematic/get-schematic-data';
import TagGroup, { TagGroups } from '@/types/response/TagGroup';
import NameTagSelector from '@/components/search/name-tag-selector';
import { useRouter } from 'next/navigation';
import deleteSchematic from '@/query/schematic/delete-schematic';
import useQueriesData from '@/hooks/use-queries-data';
import VerifyButton from '@/components/button/verify-button';
import DeleteButton from '@/components/button/delete-button';
import useToastAction from '@/hooks/use-toast-action';
import { useI18n } from '@/locales/client';
import { usePostTags } from '@/hooks/use-tags';

type UploadSchematicDetailCardProps = HTMLAttributes<HTMLDivElement> & {
  schematic: SchematicDetail;
};

export default function UploadSchematicDetailCard({
  schematic,
}: UploadSchematicDetailCardProps) {
  const { toast } = useToast();
  const { back } = useRouter();
  const { axios } = useClientAPI();
  const { schematic: schematicTags } = usePostTags();
  const [selectedTags, setSelectedTags] = useState<TagGroup[]>([]);
  const { deleteById, invalidateByKey } = useQueriesData();
  const t = useI18n();

  const { mutate: verifySchematic, isPending: isVerifying } = useMutation({
    mutationFn: (data: VerifySchematicRequest) =>
      postVerifySchematic(axios, data),
    onSuccess: () => {
      deleteById(['schematic-uploads'], schematic.id);
      invalidateByKey(['total-schematic-uploads']);
      invalidateByKey(['schematics']);
      back();
      toast({
        title: t('verify-success'),
        variant: 'success',
      });
    },
    onError: (error) => {
      toast({
        title: t('verify-fail'),
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const { mutate: deleteSchematicById, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => deleteSchematic(axios, id),
    onSuccess: () => {
      deleteById(['schematic-uploads'], schematic.id);
      invalidateByKey(['total-schematic-uploads']);
      back();
      toast({
        title: t('delete-success'),
        variant: 'success',
      });
    },
    onError: (error) => {
      toast({
        title: t('delete-fail'),
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  useEffect(() => {
    setSelectedTags(TagGroups.parseString(schematic.tags, schematicTags));
  }, [schematic.tags, schematicTags]);

  const isLoading = isVerifying || isDeleting;
  const link = `${env.url.base}/schematics/${schematic.id}`;

  const getData = useToastAction({
    title: t('copying'),
    content: t('downloading-data'),
    action: async () => await getSchematicData(axios, schematic.id),
  });

  return (
    <Detail>
      <Detail.Info>
        <div className="relative">
          <CopyButton
            className="absolute left-1 top-1 "
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
        <div className="grid w-full grid-cols-[repeat(auto-fit,3rem)] gap-2">
          <CopyButton
            className="border border-border"
            variant="outline"
            content={`Copied schematic ${schematic.name}`}
            data={getData}
          />
          <DownloadButton
            href={`${env.url.api}/schematics/${schematic.id}/download`}
            fileName={`{${schematic.name}}.msch`}
          />
          <DeleteButton
            description={`${t('delete')} ${schematic.name}`}
            isLoading={isLoading}
            onClick={() => deleteSchematicById(schematic.id)}
          />
          <VerifyButton
            description={`${t('verify')} ${schematic.name}`}
            isLoading={isLoading}
            onClick={() =>
              verifySchematic({
                id: schematic.id,
                tags: TagGroups.toString(selectedTags),
              })
            }
          />
        </div>
        <BackButton />
      </Detail.Actions>
    </Detail>
  );
}
