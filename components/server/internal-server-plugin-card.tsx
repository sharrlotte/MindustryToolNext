'use client';

import React from 'react';

import DeleteButton from '@/components/button/delete-button';
import useClientAPI from '@/hooks/use-client';
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

  const axios = useClientAPI();
  const { mutate: deletePluginById, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteInternalServerPlugin(axios, serverId, pluginId),
    onSuccess: () => {
      invalidateByKey(['servers', serverId, 'plugins']);
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
    <div className="relative grid gap-2 rounded-md border bg-card p-2">
      <h2>{name}</h2>
      <span className="text-muted-foreground">
        {isVerified ? 'Verified' : 'Unverified'}
      </span>
      <div className="flex gap-2">
        <DeleteButton
          variant="ghost"
          description={`${t('delete')} ${name}`}
          isLoading={isDeleting}
          onClick={() => deletePluginById()}
        />
      </div>
    </div>
  );
}
