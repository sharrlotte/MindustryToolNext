'use client';

import React from 'react';

import DeleteButton from '@/components/button/delete-button';
import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { useToast } from '@/hooks/use-toast';
import { InternalServerPlugin } from '@/types/response/InternalServerPlugin';

import { useMutation } from '@tanstack/react-query';
import { deleteInternalServerPlugin } from '@/query/server';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Tran from '@/components/common/tran';

type Props = {
  plugin: InternalServerPlugin;
};

export default function InternalServerPluginCard({ plugin: { serverId, name, pluginId, isVerified, description } }: Props) {
  const { toast } = useToast();
  const { invalidateByKey } = useQueriesData();

  const axios = useClientApi();
  const { mutate: deletePluginById, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteInternalServerPlugin(axios, serverId, pluginId),
    onSuccess: () => {
      toast({
        title: <Tran text="delete-success" />,
        variant: 'success',
      });
    },
    onError: (error) => {
      toast({
        title: <Tran text="delete-fail" />,
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
      <div className="relative grid h-24 gap-2 overflow-hidden rounded-sm bg-card p-4">
        <PopoverTrigger className="flex w-full items-start justify-start">
          <h2 className="line-clamp-1 overflow-hidden text-ellipsis whitespace-normal text-nowrap">{name}</h2>
        </PopoverTrigger>
        <span className="text-muted-foreground">{isVerified ? 'Verified' : 'Unverified'}</span>
        <DeleteButton
          className="right-1 top-1 backdrop-brightness-100"
          variant="ghost"
          description={<Tran text="delete-alert" args={{ name }} />}
          isLoading={isDeleting}
          onClick={() => deletePluginById()}
        />
      </div>
      <PopoverContent>
        <p>{description}</p>
      </PopoverContent>
    </Popover>
  );
}
