'use client';

import ColorText from '@/components/common/color-text';
import LoadingSpinner from '@/components/common/loading-spinner';
import LoadingWrapper from '@/components/common/loading-wrapper';
import { Button } from '@/components/ui/button';
import useClientAPI from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { useToast } from '@/hooks/use-toast';
import { useI18n } from '@/locales/client';
import getInternalServer from '@/query/server/get-internal-server';
import postReloadInternalServer from '@/query/server/post-reload-internal-server';
import postStartInternalServers from '@/query/server/post-start-internal-server';
import { InternalServerDetail } from '@/types/response/InternalServerDetail';
import { useMutation, useQuery } from '@tanstack/react-query';
import { notFound } from 'next/navigation';
import React from 'react';

type PageProps = {
  params: { id: string };
};

export default function Page({ params: { id } }: PageProps) {
  const { axios, enabled } = useClientAPI();

  const {
    data: server,
    isLoading,
    isError,
    isPending,
    error,
  } = useQuery({
    queryKey: ['internal-servers', id],
    queryFn: () => getInternalServer(axios, { id }),
    enabled,
  });

  if (isLoading || isPending) {
    return <LoadingSpinner />;
  }

  if (error || isError) {
    throw error;
  }

  if (!server) {
    return notFound();
  }

  return <Dashboard server={server} />;
}
type Props = {
  server: InternalServerDetail;
};

function Dashboard({ server }: Props) {
  const t = useI18n();

  const { started, name, description, port, mode, id, ramUsage, totalRam } =
    server;
  const { toast } = useToast();
  const { axios } = useClientAPI();
  const { invalidateByKey } = useQueriesData();

  const { mutate, isPending } = useMutation({
    mutationKey: ['internal-server, internal-servers'],
    mutationFn: () => postStartInternalServers(axios, id),
    onSuccess: () => {
      invalidateByKey(['internal-servers']);
      invalidateByKey(['internal-server']);
      toast({
        title: t('upload.success'),
        variant: 'success',
      });
    },
    onError: (error) =>
      toast({
        title: t('upload.fail'),
        description: error.message,
        variant: 'destructive',
      }),
  });

  const { mutate: reloadServer, isPending: isReloadingServer } = useMutation({
    mutationKey: ['internal-server, internal-servers'],
    mutationFn: () => postReloadInternalServer(axios, id),
    onSuccess: () => {
      invalidateByKey(['internal-servers']);
      invalidateByKey(['internal-server']);
      toast({
        title: t('upload.success'),
        variant: 'success',
      });
    },
    onError: (error) =>
      toast({
        title: t('upload.fail'),
        description: error.message,
        variant: 'destructive',
      }),
  });

  const isLoading = isPending || isReloadingServer;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-1 flex-col gap-1 bg-card p-2">
        <div>
          <span>Name: </span>
          <ColorText text={name} />
        </div>
        <div>
          <span>Description: </span>
          <ColorText text={description} />
        </div>
        <div>
          <span>Port: </span>
          <span>{port}</span>
        </div>
        <div>
          <span>Game mode: </span>
          <span>{mode}</span>
        </div>
        <div className="space-x-2">
          <span>Memory {Math.floor((ramUsage / totalRam) * 100)}%</span>
          <span>
            {ramUsage}/{totalRam}mb
          </span>
        </div>
      </div>
      <div className="flex flex-row justify-end gap-2 bg-card p-2">
        <Button
          className="w-20"
          title="Shutdown"
          variant="secondary"
          disabled={isLoading}
          onClick={() => reloadServer()}
        >
          <LoadingWrapper className="w-20" isLoading={isLoading}>
            Reload
          </LoadingWrapper>
        </Button>
        {started ? (
          <Button
            className="w-20"
            title="Shutdown"
            variant="secondary"
            disabled={isLoading}
          >
            <LoadingWrapper className="w-20" isLoading={isLoading}>
              Shutdown
            </LoadingWrapper>
          </Button>
        ) : (
          <Button
            className="w-20"
            title="Start"
            variant="primary"
            disabled={isLoading}
            onClick={() => mutate()}
          >
            <LoadingWrapper className="w-20" isLoading={isLoading}>
              Start
            </LoadingWrapper>
          </Button>
        )}
      </div>
    </div>
  );
}
