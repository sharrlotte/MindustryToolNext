'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { signOut } from 'next-auth/react';
import React from 'react';

type LogoutButtonProps = {
  className?: string;
};

export default function LogoutButton({ className }: LogoutButtonProps) {
  return (
    <Button
      className={cn('flex', className)}
      title="logout"
      onClick={() => signOut()}
    >
      Logout
    </Button>
  );
}
