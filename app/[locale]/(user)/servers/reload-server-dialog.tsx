'use client';

import React from 'react';

import Tran from '@/components/common/tran';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';

import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { reloadServers } from '@/query/server';

import { useMutation } from '@tanstack/react-query';

export default function ReloadServerDialog() {
  const axios = useClientApi();

  const { invalidateByKey } = useQueriesData();

  const { mutate, isPending } = useMutation({
    mutationKey: ['servers'],
    mutationFn: () => reloadServers(axios),
    onSuccess: () => {
      toast.success(<Tran text="update.success" />);
    },
    onError: (error) => toast.error(<Tran text="update.fail" />, { description: error.message }),
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
