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

import { useMutation } from '@tanstack/react-query';
import { createReloadInternalServer } from '@/query/server';

type Props = {
  id: string;
};

export default function ReloadServerButton({ id }: Props) {
  const axios = useClientAPI();
  const t = useI18n();
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationKey: ['internal-server, internal-servers'],
    mutationFn: () => createReloadInternalServer(axios, id),
    onSuccess: () => {
      toast({
        title: 'Reload server successfully',
        variant: 'success',
      });
      revalidate('/servers');
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
          {t('reload')}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        Are you sure you want to reload server
        <AlertDialogFooter>
          <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
          <AlertDialogAction variant="destructive" asChild>
            <Button
              title="reload"
              disabled={isPending}
              onClick={() => mutate()}
            >
              {t('reload')}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
