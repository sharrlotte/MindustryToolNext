'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { signIn } from 'next-auth/react';
import React from 'react';

type LoginButtonProps = {
  className?: string;
};

export default function LoginButton({ className }: LoginButtonProps) {
  return (
    <Button
      className={cn('flex', className)}
      title="logout"
      onClick={() => signIn()}
    >
      Login
    </Button>
  );
}
