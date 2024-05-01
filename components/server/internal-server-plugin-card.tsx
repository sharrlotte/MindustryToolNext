'use client';

import DeleteButton from '@/components/button/delete-button';
import DownloadButton from '@/components/button/download-button';
import env from '@/constant/env';
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
  plugin: { id, serverId, name, pluginId },
}: Props) {
  const { toast } = useToast();
  const { invalidateByKey } = useQueriesData();
  const t = useI18n();

  const { axios } = useClientAPI();
  const { mutate: deletePluginById, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteInternalServerPlugin(axios, serverId, id),
    onSuccess: () => {
      invalidateByKey(['plugins']);
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
    <div className="grid gap-2 rounded-md border bg-card p-2">
      <h2>{name}</h2>
      <div className="flex gap-2">
        <DeleteButton
          description={`${t('delete')} ${name}`}
          isLoading={isDeleting}
          onClick={() => deletePluginById()}
        />
        <DownloadButton
          className="w-10"
          href={`${env.url.api}/plugins/${pluginId}/download`}
          secure
          fileName={`${name}.zip`}
        />
      </div>
    </div>
  );
}
