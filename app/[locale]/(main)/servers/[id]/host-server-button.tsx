'use client';

import React, { ReactNode, useEffect, useState } from 'react';

import ColorText from '@/components/common/color-text';
import ErrorMessage from '@/components/common/error-message';
import { CheckCircleIcon } from '@/components/common/icons';
import InternalLink from '@/components/common/internal-link';
import LoadingSpinner from '@/components/common/loading-spinner';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';

import { revalidate } from '@/action/action';
import env from '@/constant/env';
import useClientApi from '@/hooks/use-client';
import useHttpStream from '@/hooks/use-http-stream';
import { getServerMaps } from '@/query/server';

import { useQuery } from '@tanstack/react-query';

type Props = {
  id: string;
};

function HasServerMap({ id, children }: { id: string; children: ReactNode }) {
  const axios = useClientApi();
  const { data, isError, isLoading } = useQuery({
    queryFn: () => getServerMaps(axios, id, { size: 1, page: 0 }),
    queryKey: ['server', id, 'maps-check'],
  });

  if (isLoading) {
    return <></>;
  }

  if (isError || !data || data.length === 0) {
    return (
      <div className="rounded-md px-2 py-1 h-9 space-x-2">
        <Tran className="text-warning" text="server.no-map-warning" />
        <InternalLink className="text-brand underline" href={`/servers/${id}/maps`}>
          <Tran text="internal-server.add-map" />
        </InternalLink>
      </div>
    );
  }

  return children;
}

export default function HostServerButton({ id }: Props) {
  const [visible, setVisible] = useState(false);

  const { data, last, mutate, isPending, isSuccess, isError, error } = useHttpStream({
    url: `${env.url.api}/servers/${id}/host`,
    method: 'POST',
    mutationKey: ['servers', id, 'host'],
  });

  useEffect(() => {
    const containers = document.getElementsByClassName('scroll-container');

    if (containers) {
      for (const container of containers) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth',
        });
      }
    }
  }, [data]);

  function handleVisible(value: boolean) {
    if (isPending) return;

    setVisible(value);

    if (isSuccess) {
      revalidate({ path: '/servers' });
    }
  }

  return (
    <HasServerMap id={id}>
      <Button
        className="w-20"
        title="Start"
        variant="primary"
        disabled={isPending}
        onClick={() => {
          mutate();
          setVisible(true);
        }}
      >
        <Tran text="server.host" />
      </Button>
      <Dialog open={visible} onOpenChange={handleVisible}>
        <DialogContent className="h-full w-full p-6 flex flex-col">
          <DialogTitle>
            <Tran text="server.hosting-server" asChild />
          </DialogTitle>
          <DialogDescription className="flex gap-1 overflow-hidden w-full text-ellipsis items-center">
            {isPending ? <LoadingSpinner className="p-0 w-4 justify-start m-0" /> : isError ? <ErrorMessage error={error} /> : <CheckCircleIcon className="w-4" />} <ColorText text={last} />
          </DialogDescription>
          <ScrollContainer className="h-full flex-1 flex w-full flex-col overflow-x-auto">
            {data?.map((text, index) => <ColorText key={index} text={text} />)}
            {isError && <ErrorMessage error={error} />}
          </ScrollContainer>
          {isSuccess && (
            <DialogClose className="ml-auto" asChild>
              <Button>
                <Tran text="server.hosted" />
              </Button>
            </DialogClose>
          )}
        </DialogContent>
      </Dialog>
    </HasServerMap>
  );
}
