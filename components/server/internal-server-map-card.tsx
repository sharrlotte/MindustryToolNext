'use client';

import DeleteButton from '@/components/button/delete-button';
import Preview from '@/components/preview/preview';
import env from '@/constant/env';
import useClientAPI from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useI18n } from '@/locales/client';
import deleteInternalServerMap from '@/query/server/delete-internal-server-map';
import InternalServerMap from '@/types/response/InternalServerMap';
import { useMutation } from '@tanstack/react-query';
import React from 'react';

type InternalServerMapCardProps = {
  map: InternalServerMap;
};

export default function InternalServerMapCard({
  map: { name, mapId, id, serverId },
}: InternalServerMapCardProps) {
  const { axios } = useClientAPI();
  const t = useI18n();
  const { invalidateByKey } = useQueriesData();
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: (mapId: string) =>
      deleteInternalServerMap(axios, serverId, mapId),
    onError: (error) => {
      toast({
        title: t('delete-fail'),
        description: error.message,
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      invalidateByKey(['internal-server-maps']);
    },
  });

  return (
    <Preview className={cn('group relative flex flex-col justify-between')}>
      <Preview.Image
        src={`${env.url.image}/maps/${mapId}.png`}
        errorSrc={`${env.url.api}/maps/${mapId}/image`}
        alt={name ?? 'internal server map'}
      />
      <Preview.Description>
        <Preview.Header className="h-12">{name}</Preview.Header>
        <Preview.Actions>
          <DeleteButton
            className="absolute right-0 top-0 h-12 w-12 border-none"
            isLoading={isPending}
            onClick={() => mutate(id)}
            description={t('delete')}
          ></DeleteButton>
        </Preview.Actions>
      </Preview.Description>
    </Preview>
  );
}
