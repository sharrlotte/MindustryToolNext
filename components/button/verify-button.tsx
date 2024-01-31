import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CheckIcon } from '@heroicons/react/24/outline';
import React, { HTMLAttributes } from 'react';

type VerifyButtonProps = HTMLAttributes<HTMLButtonElement>;

export default function VerifyButton({
  className,
  ...props
}: VerifyButtonProps) {
  return (
    <Button
      className={cn('aspect-square p-2', className)}
      variant="outline"
      title="verify"
      {...props}
    >
      <CheckIcon className="h-5 w-5" />
    </Button>
  );
}
