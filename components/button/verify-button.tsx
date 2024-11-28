'use client';

import React, { ReactNode } from 'react';

import { CheckIcon } from '@/components/common/icons';
import Tran from '@/components/common/tran';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

type VerifyButtonProps = {
  isLoading: boolean;
  onClick: () => void;
  description: ReactNode;
};

export default function VerifyButton({ isLoading, description, onClick }: VerifyButtonProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger className="flex items-center justify-center rounded-md border p-2 hover:bg-success hover:border-none" disabled={isLoading}>
        <CheckIcon className="size-5" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <Tran text="verify.confirm" />
          </AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            <Tran text="cancel" />
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button className="bg-success hover:bg-success" title="verify" onClick={onClick}>
              <Tran text="verify" />
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
