'use client';

import React, { ReactNode } from 'react';

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

import { XMarkIcon } from '@heroicons/react/24/outline';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva('hover:bg-destructive/80', {
  variants: {
    variant: {
      command: '',
      default: 'border border-border',
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
export default function DeleteButton({
  className,
  isLoading,
  variant,
  description,
  onClick,
}: DeleteButtonProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          className={cn(buttonVariants({ className, variant }))}
          variant={variant}
          size="command"
          disabled={isLoading}
        >
          <XMarkIcon className="size-5" />
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
          <AlertDialogAction
            className="bg-destructive hover:bg-destructive"
            asChild
          >
            <Button onClick={onClick}>
              <Tran text="delete" />
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
