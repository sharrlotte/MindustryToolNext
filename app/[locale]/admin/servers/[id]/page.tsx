'use client';

import ColorText from '@/components/common/color-text';
import LoadingSpinner from '@/components/common/loading-spinner';
import { Button } from '@/components/ui/button';
import useClientAPI from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { useToast } from '@/hooks/use-toast';
import { useI18n } from '@/locales/client';
import getInternalServer from '@/query/server/get-internal-server';
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

  const { started, name, description, port, mode, id } = server;
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

  return (
    <div className="flex flex-col gap-2">
      <div className="bg-card p-2">
        <ColorText className="text-4xl" text={name} />
      </div>
      <div className="flex flex-1 flex-col gap-1 bg-card p-2">
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
      </div>
      <div className="flex flex-row justify-end gap-2 bg-card p-2">
        {started ? (
          <Button
            className="min-w-20"
            title="Shutdown"
            variant="secondary"
            disabled={isPending}
          >
            Shutdown
          </Button>
        ) : (
          <Button
            className="min-w-20"
            title="Start"
            variant="primary"
            disabled={isPending}
            onClick={() => mutate()}
          >
            Start
          </Button>
        )}
      </div>
    </div>
  );
}
