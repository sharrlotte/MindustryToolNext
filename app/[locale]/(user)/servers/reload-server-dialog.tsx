'use client';

import React from 'react';

import Tran from '@/components/common/tran';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { toast } from '@/hooks/use-toast';
import { reloadInternalServers } from '@/query/server';

import { useMutation } from '@tanstack/react-query';

export default function ReloadServerDialog() {
  const axios = useClientApi();

  const { invalidateByKey } = useQueriesData();

  const { mutate, isPending } = useMutation({
    mutationKey: ['servers'],
    mutationFn: () => reloadInternalServers(axios),
    onSuccess: () => {
      toast({
        title: <Tran text="update.success" />,
        variant: 'success',
      });
    },
    onError: (error) =>
      toast({
        title: <Tran text="update.fail" />,
        description: error.message,
        variant: 'destructive',
      }),
    onSettled: () => {
      invalidateByKey(['servers']);
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="min-w-20" title="Delete" variant="destructive" disabled={isPending}>
          <Tran text="reload" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogFooter>
          <AlertDialogCancel>
            <Tran text="cancel" />
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button className="bg-destructive hover:bg-destructive" title="reload" onClick={() => mutate()}>
              <Tran text="reload" />
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
