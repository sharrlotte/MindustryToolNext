'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/i18n/client';

import { TrashIcon } from 'lucide-react';
import React from 'react';

type RemoveButtonProps = {
  isLoading: boolean;
  onClick: () => void;
  description: string;
};

export default function RemoveButton({
  isLoading,
  description,
  onClick,
}: RemoveButtonProps) {
  const t = useI18n();

  return (
    <AlertDialog>
      <AlertDialogTrigger
        className="flex items-center justify-center rounded-md border p-2"
        disabled={isLoading}
      >
        <TrashIcon className="size-5" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('remove.confirm')}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive hover:bg-destructive"
            asChild
          >
            <Button title={t('remove')} onClick={onClick}>
              {t('remove')}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
