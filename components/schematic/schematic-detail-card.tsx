'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

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
  Verifier,
} from '@/components/detail/detail';
import DislikeButton from '@/components/like/dislike-button';
import LikeButton from '@/components/like/like-button';
import LikeComponent from '@/components/like/like-component';
import LikeCount from '@/components/like/like-count';
import ItemRequirementCard from '@/components/schematic/item-requirement-card';
import { EllipsisButton } from '@/components/ui/ellipsis-button';
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

import { useMutation } from '@tanstack/react-query';
import { LinkIcon } from '@/components/common/icons';

type SchematicDetailCardProps = {
  schematic: SchematicDetail;
};

export default function SchematicDetailCard({
  schematic: {
    id,
    name,
    description,
    tags,
    requirements,
    verifierId,
    itemId,
    likes,
    userLike,
    userId,
    isVerified,
  },
}: SchematicDetailCardProps) {
  const axios = useClientAPI();
  const { session } = useSession();

  const t = useI18n();

  const getData = useToastAction({
    title: t('copying'),
    content: t('downloading-data'),
    action: async () => await getSchematicData(axios, id),
  });

  const link = `${env.url.base}/schematics/${id}`;
  const copyContent = t('copied-name', { name: name });
  const imageUrl = `${env.url.image}/schematics/${id}.png`;
  const errorImageUrl = `${env.url.api}/schematics/${id}/image`;
  const downloadUrl = `${env.url.api}/schematics/${id}/download`;
  const downloadName = `{${name}}.msch`;

  return (
    <Detail>
      <DetailInfo>
        <DetailImage src={imageUrl} errorSrc={errorImageUrl} alt={name} />
        <CopyButton variant="ghost" data={link} content={link}>
          <LinkIcon />
        </CopyButton>
        <DetailHeader>
          <DetailTitle>{name}</DetailTitle>
          <IdUserCard id={userId} />
          <Verifier verifierId={verifierId} />
          <DetailDescription>{description}</DetailDescription>
          <ItemRequirementCard requirements={requirements} />
          <DetailTagsCard tags={tags} />
        </DetailHeader>
      </DetailInfo>
      <DetailActions>
        <CopyButton content={copyContent} data={getData} />
        <DownloadButton href={downloadUrl} fileName={downloadName} />
        <LikeComponent
          itemId={itemId}
          initialLikeCount={likes}
          initialLikeData={userLike}
        >
          <LikeButton />
          <LikeCount />
          <DislikeButton />
        </LikeComponent>
        <EllipsisButton>
          <ProtectedElement
            session={session}
            ownerId={userId}
            show={isVerified}
          >
            <TakeDownSchematicButton id={id} name={name} />
            <DeleteSchematicButton id={id} name={name} />
          </ProtectedElement>
        </EllipsisButton>
      </DetailActions>
    </Detail>
  );
}

type TakeDownSchematicButtonProps = {
  id: string;
  name: string;
};

function TakeDownSchematicButton({ id, name }: TakeDownSchematicButtonProps) {
  const axios = useClientAPI();
  const t = useI18n();
  const { back } = useRouter();
  const { deleteById, invalidateByKey } = useQueriesData();
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    scope: {
      id,
    },
    mutationFn: (id: string) => putRemoveSchematic(axios, id),
    onSuccess: () => {
      deleteById(['schematic'], id);
      invalidateByKey(['schematic', 'total']);
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

  return (
    <TakeDownButton
      isLoading={isPending}
      description={t('take-down-alert', { name: name })}
      onClick={() => mutate(id)}
    />
  );
}

type DeleteSchematicButtonProps = {
  id: string;
  name: string;
};

function DeleteSchematicButton({ id, name }: DeleteSchematicButtonProps) {
  const axios = useClientAPI();
  const t = useI18n();
  const { back } = useRouter();
  const { deleteById, invalidateByKey } = useQueriesData();
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    scope: {
      id,
    },
    mutationFn: (id: string) => deleteSchematic(axios, id),
    onSuccess: () => {
      deleteById(['schematic'], id);
      invalidateByKey(['schematic', 'total']);
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

  return (
    <DeleteButton
      variant="command"
      description={t('delete-alert', { name })}
      isLoading={isPending}
      onClick={() => mutate(id)}
    />
  );
}
