'use client';

import React from 'react';

import DeleteButton from '@/components/button/delete-button';
import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { useToast } from '@/hooks/use-toast';
import { useI18n } from '@/i18n/client';
import { InternalServerPlugin } from '@/types/response/InternalServerPlugin';

import { useMutation } from '@tanstack/react-query';
import { deleteInternalServerPlugin } from '@/query/server';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

type Props = {
  plugin: InternalServerPlugin;
};

export default function InternalServerPluginCard({ plugin: { serverId, name, pluginId, isVerified, description } }: Props) {
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
    <Popover>
      <div className="relative grid gap-2 rounded-sm bg-card p-4 h-24 overflow-hidden">
        <PopoverTrigger className="flex w-full items-start justify-start">
          <h2 className="line-clamp-1 overflow-hidden text-ellipsis whitespace-normal text-nowrap">{name}</h2>
        </PopoverTrigger>
        <span className="text-muted-foreground">{isVerified ? 'Verified' : 'Unverified'}</span>
        <DeleteButton className="right-1 top-1 backdrop-brightness-100" variant="ghost" description={t('delete-alert', { name })} isLoading={isDeleting} onClick={() => deletePluginById()} />
      </div>
      <PopoverContent>
        <p>{description}</p>
      </PopoverContent>
    </Popover>
  );
}
