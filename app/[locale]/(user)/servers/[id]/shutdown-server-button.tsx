'use client';

import React from 'react';

import { revalidate } from '@/action/action';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import useClientAPI from '@/hooks/use-client';
import { useToast } from '@/hooks/use-toast';
import { useI18n } from '@/locales/client';
import postReloadInternalServer from '@/query/server/post-reload-internal-server';

import { useMutation } from '@tanstack/react-query';

type Props = {
  id: string;
};

export default function ShutdownServerButton({ id }: Props) {
  const axios = useClientAPI();
  const t = useI18n();
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationKey: ['internal-server, internal-servers'],
    mutationFn: () => postReloadInternalServer(axios, id),
    onSuccess: () => {
      toast({
        title: 'Reload server successfully',
        variant: 'success',
      });
      revalidate('/admin/servers');
    },
    onError: (error) =>
      toast({
        title: 'Reload server failed',
        description: error.message,
        variant: 'destructive',
      }),
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          className="min-w-20"
          title="Delete"
          variant="destructive"
          disabled={isPending}
        >
          Shutdown
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        Are you sure you want to shutdown server
        <AlertDialogFooter>
          <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
          <AlertDialogAction variant="destructive" asChild>
            <Button
              title="Shutdown"
              disabled={isPending}
              onClick={() => mutate()}
            >
              Shutdown
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
