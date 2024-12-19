'use client';

import React, { useEffect, useState } from 'react';

import ColorText from '@/components/common/color-text';
import { Hidden } from '@/components/common/hidden';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';

import { revalidate } from '@/action/action';
import env from '@/constant/env';
import useHttpStream from '@/hooks/use-http-stream';

type Props = {
  id: string;
};

export default function ReloadServerButton({ id }: Props) {
  const [visible, setVisible] = useState(false);

  const { data, mutate, isPending, isSuccess } = useHttpStream({
    url: `${env.url.api}/internal-servers/${id}/reload`,
    method: 'POST',
    mutationKey: ['internal-servers', id, 'reload'],
  });

  useEffect(() => {
    const containers = document.getElementsByClassName('pagination-container');

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
    setVisible(value);

    if (isSuccess) {
      revalidate({ path: '/servers' });
    }
  }
  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="min-w-20" title="Delete" variant="destructive" disabled={isPending}>
            <Tran text="server.reload" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogFooter>
            <AlertDialogCancel>
              <Tran text="cancel" />
            </AlertDialogCancel>
            <AlertDialogAction variant="destructive" asChild>
              <Button
                title="reload"
                disabled={isPending}
                onClick={() => {
                  mutate();
                  setVisible(true);
                }}
              >
                <Tran text="server.reload" />
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Dialog open={visible} onOpenChange={handleVisible}>
        <DialogContent className="h-full w-full p-6 flex flex-col">
          <DialogTitle>
            <Tran text="server.reload" asChild />
          </DialogTitle>
          <Hidden>
            <DialogDescription></DialogDescription>
          </Hidden>
          <ScrollContainer className="h-full flex-1 flex w-full flex-col overflow-x-auto">{data?.split('\n').map((text, index) => <ColorText key={index} text={text} />)}</ScrollContainer>
          {isSuccess && (
            <DialogClose className="ml-auto" asChild>
              <Button>
                <Tran text="server.started" />
              </Button>
            </DialogClose>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
