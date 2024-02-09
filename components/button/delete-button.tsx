import LoadingWrapper from '@/components/common/loading-wrapper';
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
import { XMarkIcon } from '@heroicons/react/24/outline';
import React from 'react';

type DeleteButtonProps = {
  isLoading: boolean;
  onClick: () => void;
  description: string;
};

export default function DeleteButton({
  isLoading,
  description,
  onClick,
}: DeleteButtonProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        className="rounded-md border p-2 flex justify-center items-center"
        disabled={isLoading}
      >
        <LoadingWrapper isLoading={isLoading}>
          <XMarkIcon className="h-5 w-5" />
        </LoadingWrapper>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-destructive" asChild>
            <Button title="Delete" onClick={onClick}>
              Delete
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
