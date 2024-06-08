'use client';

import DeleteButton from '@/components/button/delete-button';
import useClientAPI from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { useToast } from '@/hooks/use-toast';
import { useI18n } from '@/locales/client';
import deleteInternalServerPlugin from '@/query/server/delete-internal-server-plugin';
import InternalServerPlugin from '@/types/response/InternalServerPlugin';

import { useMutation } from '@tanstack/react-query';
import React from 'react';

type Props = {
  plugin: InternalServerPlugin;
};

export default function InternalServerPluginCard({
  plugin: { id, serverId, name },
}: Props) {
  const { toast } = useToast();
  const { invalidateByKey } = useQueriesData();
  const t = useI18n();

  const { axios } = useClientAPI();
  const { mutate: deletePluginById, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteInternalServerPlugin(axios, serverId, id),
    onSuccess: () => {
      invalidateByKey(['internal-server-plugins']);
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
      <div className="flex gap-2">
        <DeleteButton
          className="absolute right-1 top-1 border-none"
          description={`${t('delete')} ${name}`}
          isLoading={isDeleting}
          onClick={() => deletePluginById()}
        />
      </div>
    </div>
  );
}
