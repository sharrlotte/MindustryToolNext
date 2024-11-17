'use client';

import React from 'react';

import { revalidate } from '@/action/action';
import Tran from '@/components/common/tran';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import useClientApi from '@/hooks/use-client';
import { useToast } from '@/hooks/use-toast';
import { createReloadInternalServer } from '@/query/server';

import { useMutation } from '@tanstack/react-query';

type Props = {
  id: string;
};

export default function ReloadServerButton({ id }: Props) {
  const axios = useClientApi();
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationKey: ['internal-server, internal-servers'],
    mutationFn: () => createReloadInternalServer(axios, id),
    onSuccess: () => {
      toast({
        title: <Tran text="server.reload-success" />,
        variant: 'success',
      });
    },
    onError: (error) =>
      toast({
        title: <Tran text="server.reload-fail" />,
        description: error.message,
        variant: 'destructive',
      }),
    onSettled: () => {
      revalidate({ path: '/servers' });
    },
  });

  return (
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
            <Button title="reload" disabled={isPending} onClick={() => mutate()}>
              <Tran text="server.reload" />
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
