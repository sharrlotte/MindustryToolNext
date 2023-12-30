'use client';

import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/outline';
import { signOut } from 'next-auth/react';
import React from 'react';

export default function LogoutButton({ className, ...props }: ButtonProps) {
  return (
    <Button className={cn(className)} onClick={() => signOut()} {...props}>
      <ArrowRightStartOnRectangleIcon className="h-5 w-5" />
    </Button>
  );
}
