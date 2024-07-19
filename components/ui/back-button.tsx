'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

import { Button, ButtonProps } from '@/components/ui/button';

export default function BackButton({
  children,
  ...props
}: Omit<ButtonProps, 'title'>) {
  const router = useRouter();

  children = children ?? <ArrowLeft className="w-5 h-5" />;

  return (
    <Button
      className="whitespace-nowrap"
      title="back"
      variant="outline"
      {...props}
      onClick={() => router.back()}
    >
      {children}
    </Button>
  );
}
