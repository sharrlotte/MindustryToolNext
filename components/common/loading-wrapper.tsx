import LoadingSpinner from '@/components/common/loading-spinner';
import { ButtonVariants, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import React, { ReactNode } from 'react';

type LoadingWrapperProps = {
  className?: string;
  isLoading: boolean;
  children?: ReactNode;
};
export default function LoadingWrapper({
  className,
  isLoading,
  children,
}: LoadingWrapperProps) {
  if (isLoading) {
    return <LoadingSpinner className={cn(className)} />;
  }

  return children;
}
