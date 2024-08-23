'use client';

import React, { useState } from 'react';

import InfinitePage from '@/components/common/infinite-page';
import LoadingScreen from '@/components/common/loading-screen';
import LoadingSpinner from '@/components/common/loading-spinner';
import NoResult from '@/components/common/no-result';
import NameTagSearch from '@/components/search/name-tag-search';
import InternalServerPluginCard from '@/components/server/internal-server-plugin-card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import useClientAPI from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import useSafeParam from '@/hooks/use-safe-param';
import useSearchPageParams from '@/hooks/use-search-page-params';
import { useSearchTags } from '@/hooks/use-tags';
import { useToast } from '@/hooks/use-toast';
import { useI18n } from '@/locales/client';

import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createInternalServerPlugin,
  getInternalServerPlugins,
} from '@/query/server';
import { getPlugins } from '@/query/plugin';

export default function Page() {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const id = useSafeParam().get('id');

  return (
    <div className="flex flex-col gap-2 overflow-hidden pl-2">
      <div className=" flex justify-end bg-card p-2">
        <AddPluginDialog serverId={id} />
      </div>
      <div
        className="flex h-full w-full flex-col gap-2 overflow-y-auto"
        ref={(ref) => setContainer(ref)}
      >
        <InfinitePage
          className="grid w-full gap-2 md:grid-cols-2 lg:grid-cols-3"
          params={{ page: 0, size: 20 }}
          queryKey={['servers', id, 'plugins']}
          getFunc={(axios, params) =>
            getInternalServerPlugins(axios, id, params)
          }
          container={() => container}
        >
          {(data) => (
            <InternalServerPluginCard key={data.pluginId} plugin={data} />
          )}
        </InfinitePage>
      </div>
    </div>
  );
}

type AddPluginDialogProps = {
  serverId: string;
};

function AddPluginDialog({ serverId }: AddPluginDialogProps) {
  const { toast } = useToast();
  const { plugin } = useSearchTags();
  const [show, setShow] = useState(false);
  const axios = useClientAPI();
  const t = useI18n();

  const params = useSearchPageParams();
  const { invalidateByKey } = useQueriesData();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['plugins', params],
    queryFn: () => getPlugins(axios, params),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (pluginId: string) =>
      createInternalServerPlugin(axios, serverId, { pluginId }),
    onError: (error) => {
      toast({
        title: t('server.upload-fail'),
        description: error.message,
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      setShow(false);
      invalidateByKey(['servers', serverId, 'plugins']);
    },
  });

  function render() {
    if (isLoading) {
      return <LoadingSpinner />;
    }

    if (isError) {
      return <span>{error.message}</span>;
    }

    if (!data || data?.length === 0) {
      return <NoResult />;
    }

    return data?.map(({ id, name, description }) => (
      <Button
        className="flex h-fit w-full flex-col items-start justify-start rounded-md border border-border p-2 text-start hover:bg-brand"
        variant="outline"
        key={id}
        title={name}
        onClick={() => mutate(id)}
      >
        <h3>{name}</h3>
        <span>{description}</span>
      </Button>
    ));
  }

  if (isPending) {
    return <LoadingScreen />;
  }

  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogTrigger asChild>
        <Button
          className="ml-auto"
          title={t('internal-server.add-plugin')}
          variant="secondary"
        >
          {t('internal-server.add-plugin')}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full p-6">
        <DialogTitle>{t('internal-server.select-plugin')}</DialogTitle>
        <div className="flex h-full flex-col justify-start gap-2 overflow-hidden">
          <NameTagSearch tags={plugin} />
          <div className="flex h-full w-full flex-col gap-2 overflow-y-auto">
            {render()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
