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
  return (
    <AlertDialog>
      <AlertDialogTrigger
        className="aspect-square h-9 w-9 rounded-md border p-2"
        disabled={isLoading}
      >
        <LoadingWrapper isLoading={isLoading}>
          <CheckIcon className="h-5 w-5" />
        </LoadingWrapper>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button title="Verify" onClick={onClick}>
              Verify
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
