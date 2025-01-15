'use client';

import React, { ReactNode } from 'react';

import { TakeDownIcon } from '@/components/common/icons';
import Tran from '@/components/common/tran';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

type TakeDownButtonProps = {
  isLoading: boolean;
  onClick: () => void;
  description: ReactNode;
};

export default function TakeDownButton({ isLoading, description, onClick }: TakeDownButtonProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild disabled={isLoading}>
        <Button className="hover:bg-destructive/80" variant="command" size="command" disabled={isLoading}>
          <TakeDownIcon className="size-5" />
          <Tran text="take-down" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <Tran text="take-down.confirm" />
          </AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            <Tran text="cancel" />
          </AlertDialogCancel>
          <AlertDialogAction className="bg-destructive hover:bg-destructive" asChild>
            <Button title="take-down" onClick={onClick}>
              <Tran text="take-down" />
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
