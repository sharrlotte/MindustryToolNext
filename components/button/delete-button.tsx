'use client';

import React, { ReactNode } from 'react';

import Tran from '@/components/common/tran';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { XIcon } from '@/components/common/icons';

const buttonVariants = cva('hover:bg-destructive/80', {
  variants: {
    variant: {
      command: '',
      default: 'border border-border bg-transparent',
      ghost: 'border-none absolute w-fit backdrop-brightness-50',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export type DeleteButtonProps = {
  className?: string;
  isLoading: boolean;
  description: ReactNode;
  onClick: () => void;
} & VariantProps<typeof buttonVariants>;
export default function DeleteButton({ className, isLoading, variant, description, onClick }: DeleteButtonProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className={cn(buttonVariants({ className, variant }))} variant={variant} size="command" disabled={isLoading}>
          <XIcon />
          {variant === 'command' && <Tran text="delete" />}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <Tran text="are-you-sure" />
          </AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            <Tran text="cancel" />
          </AlertDialogCancel>
          <AlertDialogAction className="bg-destructive hover:bg-destructive" asChild>
            <Button onClick={onClick}>
              <Tran text="delete" />
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
