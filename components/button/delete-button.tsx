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
import { cn } from '@/lib/utils';
import { useI18n } from '@/locales/client';

import { XMarkIcon } from '@heroicons/react/24/outline';

type DeleteButtonProps = {
  className?: string;
  isLoading: boolean;
  description: string;
  onClick: () => void;
};

export default function DeleteButton({
  className,
  isLoading,
  description,
  onClick,
}: DeleteButtonProps) {
  const t = useI18n();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          className={cn(className)}
          variant="command"
          size="command"
          disabled={isLoading}
        >
          <LoadingWrapper isLoading={isLoading}>
            <XMarkIcon className="size-5" />
            <Tran text="delete" />
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
            <Button title={t('delete')} onClick={onClick}>
              {t('delete')}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
