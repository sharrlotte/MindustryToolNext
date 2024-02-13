'use client';

import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRightEndOnRectangleIcon } from '@heroicons/react/24/outline';
import { signIn } from 'next-auth/react';
import React from 'react';

export default function LoginButton({ className, ...props }: ButtonProps) {
  return (
    <Button
      className={cn('flex justify-center p-2', className)}
      onClick={() => signIn()}
      variant="primary"
      {...props}
    >
      Login
      <ArrowRightEndOnRectangleIcon className="h-5 w-5" />
    </Button>
  );
}
