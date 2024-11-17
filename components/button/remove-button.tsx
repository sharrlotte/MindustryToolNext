'use client';

import { TrashIcon } from 'lucide-react';
import React from 'react';

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

type RemoveButtonProps = {
  isLoading: boolean;
  onClick: () => void;
  description: string;
};

export default function RemoveButton({ isLoading, description, onClick }: RemoveButtonProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger className="flex items-center justify-center rounded-md border p-2" disabled={isLoading}>
        <TrashIcon className="size-5" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <Tran text="remove.confirm" />
          </AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            <Tran text="cancel" />
          </AlertDialogCancel>
          <AlertDialogAction className="bg-destructive hover:bg-destructive" asChild>
            <Button title="remove" onClick={onClick}>
              <Tran text="remove" />
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
