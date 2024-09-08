'use client';

import React from 'react';

import DeleteButton from '@/components/button/delete-button';
import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { useToast } from '@/hooks/use-toast';
import { useI18n } from '@/locales/client';
import { InternalServerPlugin } from '@/types/response/InternalServerPlugin';

import { useMutation } from '@tanstack/react-query';
import { deleteInternalServerPlugin } from '@/query/server';

type Props = {
  plugin: InternalServerPlugin;
};

export default function InternalServerPluginCard({
  plugin: { serverId, name, pluginId, isVerified },
}: Props) {
  const { toast } = useToast();
  const { invalidateByKey } = useQueriesData();
  const t = useI18n();

  const axios = useClientApi();
  const { mutate: deletePluginById, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteInternalServerPlugin(axios, serverId, pluginId),
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
      invalidateByKey(['servers', serverId, 'plugins']);
    },
  });

  return (
    <div className="relative grid gap-2 rounded-sm bg-card p-2">
      <h2>{name}</h2>
      <span className="text-muted-foreground">
        {isVerified ? 'Verified' : 'Unverified'}
      </span>
      <DeleteButton
        className="right-1 top-1 backdrop-brightness-100"
        variant="ghost"
        description={`${t('delete')} ${name}`}
        isLoading={isDeleting}
        onClick={() => deletePluginById()}
      />
    </div>
  );
}
