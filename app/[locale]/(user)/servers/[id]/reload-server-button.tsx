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
import useClientApi from '@/hooks/use-client';
import { useToast } from '@/hooks/use-toast';
import { useI18n } from '@/i18n/client';

import { useMutation } from '@tanstack/react-query';
import { createReloadInternalServer } from '@/query/server';

type Props = {
  id: string;
};

export default function ReloadServerButton({ id }: Props) {
  const axios = useClientApi();
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
    },
    onError: (error) =>
      toast({
        title: 'Reload server failed',
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
