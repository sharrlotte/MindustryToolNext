'use client';

import { useRouter } from 'next/navigation';
import React, { HTMLAttributes } from 'react';

import CopyButton from '@/components/button/copy-button';
import DeleteButton from '@/components/button/delete-button';
import DownloadButton from '@/components/button/download-button';
import TakeDownButton from '@/components/button/take-down-button';
import {
  Detail,
  DetailActions,
  DetailDescription,
  DetailHeader,
  DetailImage,
  DetailInfo,
  DetailTagsCard,
  DetailTitle,
} from '@/components/detail/detail';
import DislikeButton from '@/components/like/dislike-button';
import LikeButton from '@/components/like/like-button';
import LikeComponent from '@/components/like/like-component';
import LikeCount from '@/components/like/like-count';
import ItemRequirementCard from '@/components/schematic/item-requirement-card';
import BackButton from '@/components/ui/back-button';
import IdUserCard from '@/components/user/id-user-card';
import env from '@/constant/env';
import { useSession } from '@/context/session-context';
import useClientAPI from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { useToast } from '@/hooks/use-toast';
import useToastAction from '@/hooks/use-toast-action';
import ProtectedElement from '@/layout/protected-element';
import { useI18n } from '@/locales/client';
import deleteSchematic from '@/query/schematic/delete-schematic';
import getSchematicData from '@/query/schematic/get-schematic-data';
import putRemoveSchematic from '@/query/schematic/put-remove-schematic';
import { SchematicDetail } from '@/types/response/SchematicDetail';

import { LinkIcon } from '@heroicons/react/24/outline';
import { useMutation } from '@tanstack/react-query';

type SchematicDetailCardProps = HTMLAttributes<HTMLDivElement> & {
  schematic: SchematicDetail;
};

export default function SchematicDetailCard({
  schematic,
}: SchematicDetailCardProps) {
  const axios = useClientAPI();
  const { deleteById, invalidateByKey } = useQueriesData();
  const { back } = useRouter();
  const { toast } = useToast();
  const { session } = useSession();

  const t = useI18n();

  const { mutate: removeSchematic, isPending: isRemoving } = useMutation({
    mutationFn: (id: string) => putRemoveSchematic(axios, id),
    onSuccess: () => {
      deleteById(['schematics'], schematic.id);
      invalidateByKey(['schematic-uploads']);
      back();
      toast({
        title: t('take-down-success'),
        variant: 'success',
      });
    },
    onError: (error) => {
      toast({
        title: t('take-down-fail'),
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

  const isLoading = isRemoving || isDeleting;

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
          <div className="flex items-end gap-2">
            <span>{t('verified-by')}</span>
            <IdUserCard id={schematic.verifyAdmin} />
          </div>
          <DetailDescription>{schematic.description}</DetailDescription>
          <ItemRequirementCard requirement={schematic.requirement} />
          <DetailTagsCard tags={schematic.tags} />
        </DetailHeader>
      </DetailInfo>
      <DetailActions className="flex justify-between">
        <div className="grid w-full grid-cols-[repeat(auto-fit,3rem)] gap-2">
          <CopyButton
            className="border border-border "
            variant="outline"
            content={t('copied-name', { name: schematic.name })}
            data={getData}
          />
          <DownloadButton
            href={`${env.url.api}/schematics/${schematic.id}/download`}
            fileName={`{${schematic.name}}.msch`}
          />
          <LikeComponent
            itemId={schematic.itemId}
            initialLikeCount={schematic.like}
            initialLikeData={schematic.userLike}
          >
            <LikeButton />
            <LikeCount />
            <DislikeButton />
          </LikeComponent>
          <ProtectedElement
            session={session}
            ownerId={schematic.authorId}
            show={schematic.status === 'VERIFIED'}
          >
            <TakeDownButton
              isLoading={isLoading}
              description={t('take-down-alert', { name: schematic.name })}
              onClick={() => removeSchematic(schematic.id)}
            />
          </ProtectedElement>
          <ProtectedElement session={session} ownerId={schematic.authorId}>
            <DeleteButton
              description={`${t('delete')} ${schematic.name}`}
              isLoading={isLoading}
              onClick={() => deleteSchematicById(schematic.id)}
            />
          </ProtectedElement>
        </div>
        <BackButton />
      </DetailActions>
    </Detail>
  );
}
