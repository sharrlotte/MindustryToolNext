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
import { useI18n } from '@/locales/client';
import useToastAction from '@/hooks/use-toast-action';
import deleteSchematic from '@/query/schematic/delete-schematic';
import DeleteButton from '@/components/button/delete-button';

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
    <Detail padding={padding}>
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
          <div className="flex items-end gap-2">
            <span>{t('verified-by')}</span>
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
            className="border border-border "
            variant="outline"
            content={t('copied-name', { name: schematic.name })}
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
      </Detail.Actions>
    </Detail>
  );
}
