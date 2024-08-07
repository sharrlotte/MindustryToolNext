'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

import Tran from '@/components/common/tran';
import { Button, ButtonProps } from '@/components/ui/button';

export default function BackButton({
  children,
  ...props
}: Omit<ButtonProps, 'title'>) {
  const router = useRouter();

  children = children ?? (
    <>
      <ArrowLeft className="w-5 h-5" />
      <Tran text="back" />
    </>
  );

  return (
    <Button
      className="whitespace-nowrap gap-1 pl-1.5"
      title="back"
      variant="outline"
      {...props}
      onClick={() => router.back()}
    >
      {children}
    </Button>
  );
}
