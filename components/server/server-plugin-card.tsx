'use client';

import React from 'react';

import DeleteButton from '@/components/button/delete-button';
import Tran from '@/components/common/tran';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from '@/components/ui/sonner';

import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { deleteServerPlugin } from '@/query/server';
import { ServerPlugin } from '@/types/response/ServerPlugin';

import { useMutation } from '@tanstack/react-query';

type Props = {
  plugin: ServerPlugin;
};

export default function ServerPluginCard({ plugin: { serverId, pluginId, name, description } }: Props) {
  const { invalidateByKey } = useQueriesData();

  const axios = useClientApi();
  const { mutate: deletePluginById, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteServerPlugin(axios, serverId, pluginId),
    onSuccess: () => {
      toast.success(<Tran text="delete-success" />);
    },
    onError: (error) => {
      toast.error(<Tran text="delete-fail" />, { description: error.message });
    },
    onSettled: () => {
      invalidateByKey(['servers', serverId, 'plugins']);
    },
  });

  return (
    <Popover>
      <div className="relative grid h-32 gap-2 overflow-hidden rounded-sm bg-card p-4">
        <PopoverTrigger className="flex w-full items-start justify-start overflow-hidden text-ellipsis">
          <h2 className="line-clamp-1 overflow-hidden text-ellipsis whitespace-normal text-nowrap">{name}</h2>
        </PopoverTrigger>
        <DeleteButton className="right-1 top-1 backdrop-brightness-100" variant="ghost" description={<Tran text="delete-alert" args={{ name }} />} isLoading={isDeleting} onClick={() => deletePluginById()} />
      </div>
      <PopoverContent>
        <p>{description}</p>
      </PopoverContent>
    </Popover>
  );
}
