'use client';

import React, { useEffect, useState } from 'react';

import ColorText from '@/components/common/color-text';
import { CheckCircleIcon } from '@/components/common/icons';
import LoadingSpinner from '@/components/common/loading-spinner';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';

import { revalidate } from '@/action/action';
import env from '@/constant/env';
import useHttpStream from '@/hooks/use-http-stream';

type Props = {
  id: string;
};

export default function HostServerButton({ id }: Props) {
  const [visible, setVisible] = useState(false);

  const { data, last, mutate, isPending, isSuccess } = useHttpStream({
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
    <>
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
            {isPending ? <LoadingSpinner className="p-0 w-4 justify-start m-0" /> : <CheckCircleIcon className="w-4" />} <ColorText text={last} />
          </DialogDescription>
          <ScrollContainer className="h-full flex-1 flex w-full flex-col overflow-x-auto">{data?.map((text, index) => <ColorText key={index} text={text} />)}</ScrollContainer>
          {isSuccess && (
            <DialogClose className="ml-auto" asChild>
              <Button>
                <Tran text="server.hosted" />
              </Button>
            </DialogClose>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
