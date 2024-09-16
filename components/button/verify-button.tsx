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

import { CheckIcon } from '@heroicons/react/24/outline';
import React from 'react';

type VerifyButtonProps = {
  isLoading: boolean;
  onClick: () => void;
  description: string;
};

export default function VerifyButton({
  isLoading,
  description,
  onClick,
}: VerifyButtonProps) {
  const t = useI18n();

  return (
    <AlertDialog>
      <AlertDialogTrigger
        className="flex items-center justify-center rounded-md border p-2 hover:bg-success"
        disabled={isLoading}
      >
        <CheckIcon className="size-5" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('verify.confirm')}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              className="bg-success hover:bg-success"
              title={t('verify')}
              onClick={onClick}
            >
              {t('verify')}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
