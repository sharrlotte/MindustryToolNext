'use client';

import React from 'react';

import LoadingWrapper from '@/components/common/loading-wrapper';
import Tran from '@/components/common/tran';
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
import { useI18n } from '@/locales/client';

import { TrashIcon } from '@heroicons/react/24/outline';

type TakeDownButtonProps = {
  isLoading: boolean;
  onClick: () => void;
  description: string;
};

export default function TakeDownButton({
  isLoading,
  description,
  onClick,
}: TakeDownButtonProps) {
  const t = useI18n();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild disabled={isLoading}>
        <Button variant="command" size="command" disabled={isLoading}>
          <LoadingWrapper isLoading={isLoading}>
            <TrashIcon className="h-5 w-5" />
            <Tran text="take-down" />
          </LoadingWrapper>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('are-you-sure')}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive hover:bg-destructive"
            asChild
          >
            <Button title={t('take-down')} onClick={onClick}>
              {t('take-down')}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
