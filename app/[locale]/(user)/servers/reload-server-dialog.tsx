'use client';

import React from 'react';

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
import useQueriesData from '@/hooks/use-queries-data';
import { toast } from '@/hooks/use-toast';
import { useI18n } from '@/locales/client';

import { useMutation } from '@tanstack/react-query';
import { reloadInternalServers } from '@/query/server';

export default function ReloadServerDialog() {
  const t = useI18n();
  const axios = useClientApi();
  const { invalidateByKey } = useQueriesData();
  const { mutate, isPending } = useMutation({
    mutationKey: ['servers'],
    mutationFn: () => reloadInternalServers(axios),
    onSuccess: () => {
      invalidateByKey(['servers']);
      toast({
        title: t('update.success'),
        variant: 'success',
      });
    },
    onError: (error) =>
      toast({
        title: t('update.fail'),
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
        Are you sure you want to reload all servers
        <AlertDialogFooter>
          <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              className="bg-destructive hover:bg-destructive"
              title={t('reload')}
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
