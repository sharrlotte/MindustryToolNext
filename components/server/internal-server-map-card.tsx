'use client';

import React from 'react';

import DeleteButton from '@/components/button/delete-button';
import { Preview, PreviewDescription, PreviewHeader, PreviewImage } from '@/components/common/preview';
import env from '@/constant/env';
import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { useToast } from '@/hooks/use-toast';
import { useI18n } from '@/i18n/client';
import { InternalServerMap } from '@/types/response/InternalServerMap';

import { useMutation } from '@tanstack/react-query';
import { deleteInternalServerMap } from '@/query/server';
import InternalLink from '@/components/common/internal-link';

type InternalServerMapCardProps = {
  map: InternalServerMap;
};

export default function InternalServerMapCard({ map: { name, mapId, serverId } }: InternalServerMapCardProps) {
  const axios = useClientApi();
  const t = useI18n();
  const { invalidateByKey } = useQueriesData();
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteInternalServerMap(axios, serverId, mapId),
    onSuccess: () => {
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
    onSettled: () => {
      invalidateByKey(['servers', serverId, 'maps']);
    },
  });

  return (
    <Preview className="group relative flex flex-col justify-between">
      <InternalLink href={`/maps/${mapId}`}>
        <PreviewImage src={`${env.url.image}/map-previews/${mapId}${env.imageFormat}`} errorSrc={`${env.url.api}/maps/${mapId}/image`} alt={name ?? 'internal server map'} />
      </InternalLink>
      <PreviewDescription>
        <PreviewHeader className="h-12">{name}</PreviewHeader>
        <DeleteButton className="right-1 top-1" variant="ghost" isLoading={isPending} onClick={() => mutate()} description={t('delete')} />
      </PreviewDescription>
    </Preview>
  );
}
