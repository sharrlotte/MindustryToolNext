'use client';

import CopyButton from '@/components/button/copy-button';
import DeleteButton from '@/components/button/delete-button';
import DownloadButton from '@/components/button/download-button';
import VerifyButton from '@/components/button/verify-button';
import {
  Detail,
  DetailActions,
  DetailDescription,
  DetailHeader,
  DetailImage,
  DetailInfo,
  DetailTitle,
} from '@/components/detail/detail';
import ItemRequirementCard from '@/components/schematic/item-requirement-card';
import NameTagSelector from '@/components/search/name-tag-selector';
import BackButton from '@/components/ui/back-button';
import IdUserCard from '@/components/user/id-user-card';
import env from '@/constant/env';
import useClientAPI from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { usePostTags } from '@/hooks/use-tags';
import { useToast } from '@/hooks/use-toast';
import useToastAction from '@/hooks/use-toast-action';
import { useI18n } from '@/locales/client';
import deleteSchematic from '@/query/schematic/delete-schematic';
import getSchematicData from '@/query/schematic/get-schematic-data';
import postVerifySchematic from '@/query/schematic/post-verify-schematic';
import VerifySchematicRequest from '@/types/request/VerifySchematicRequest';
import { SchematicDetail } from '@/types/response/SchematicDetail';
import TagGroup, { TagGroups } from '@/types/response/TagGroup';

import { LinkIcon } from '@heroicons/react/24/outline';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { HTMLAttributes, useEffect, useState } from 'react';

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
      <DetailInfo>
        <div className="relative">
          <CopyButton
            className="absolute left-1 top-1 "
            variant="ghost"
            data={link}
            content={link}
          >
            <LinkIcon className="h-5 w-5" />
          </CopyButton>
          <DetailImage
            src={`${env.url.image}/schematics/${schematic.id}.png`}
            errorSrc={`${env.url.api}/schematics/${schematic.id}/image`}
            alt={schematic.name}
          />
        </div>
        <DetailHeader>
          <DetailTitle>{schematic.name}</DetailTitle>
          <IdUserCard id={schematic.authorId} />
          <DetailDescription>{schematic.description}</DetailDescription>
          <ItemRequirementCard requirement={schematic.requirement} />
          <NameTagSelector
            tags={schematicTags}
            value={selectedTags}
            onChange={setSelectedTags}
          />
        </DetailHeader>
      </DetailInfo>
      <DetailActions className="flex justify-between">
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
      </DetailActions>
    </Detail>
  );
}
