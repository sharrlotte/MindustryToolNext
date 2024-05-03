import LoadingSpinner from '@/components/common/loading-spinner';
import { ButtonVariants, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import React, { ReactNode } from 'react';

type LoadingWrapperProps = {
  className?: string;
  isLoading: boolean;
  children?: ReactNode;
} & ButtonVariants;
export default function LoadingWrapper({
  className,
  variant,
  size,
  isLoading,
  children,
}: LoadingWrapperProps) {
  if (isLoading) {
    return (
      <LoadingSpinner
        className={cn(buttonVariants({ variant, size, className }))}
      />
    );
  }

  return children;
}
