'use client';

import React from 'react';
import { toast } from 'sonner';

import Tran from '@/components/common/tran';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

import { revalidate } from '@/action/action';
import useClientApi from '@/hooks/use-client';
import { shutdownInternalServer } from '@/query/server';

import { useMutation } from '@tanstack/react-query';

type Props = {
  id: string;
};

export default function ShutdownServerButton({ id }: Props) {
  const axios = useClientApi();

  const { mutate, isPending } = useMutation({
    mutationKey: ['internal-servers'],
    mutationFn: () => shutdownInternalServer(axios, id),
    onSuccess: () => {
      toast.success(<Tran text="server.shutdown-success" />);
    },
    onError: (error) => toast.error(<Tran text="server.shutdown-fail" />, { description: error.message }),
    onSettled: () => {
      revalidate({ path: '/servers' });
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="min-w-20" title="Delete" variant="destructive" disabled={isPending}>
          <Tran text="server.shutdown" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <Tran text="server.shutdown-confirm" />
        <AlertDialogFooter>
          <AlertDialogCancel>
            <Tran text="cancel" />
          </AlertDialogCancel>
          <AlertDialogAction variant="destructive" asChild>
            <Button title="Shutdown" disabled={isPending} onClick={() => mutate()}>
              <Tran text="server.shutdown" />
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
