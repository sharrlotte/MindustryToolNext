'use client';

import { Button, ButtonProps } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function BackButton({
  children,
  ...props
}: Omit<ButtonProps, 'title'>) {
  const router = useRouter();

  return (
    <Button
      title="back"
      variant="outline"
      {...props}
      onClick={() => router.back()}
    >
      {children ?? 'Back'}
    </Button>
  );
}
