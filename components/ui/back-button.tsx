'use client';

import { useRouter } from 'next/navigation';

import { BackIcon } from '@/components/common/icons';
import Tran from '@/components/common/tran';
import { Button, ButtonProps } from '@/components/ui/button';

export default function BackButton({ children, ...props }: Omit<ButtonProps, 'title'>) {
  const router = useRouter();

  children = children ?? (
    <>
      <BackIcon className="size-5" />
      <Tran text="back" />
    </>
  );

  return (
    <Button className="gap-1 whitespace-nowrap text-nowrap" title="back" variant="outline" {...props} onClick={() => router.back()}>
      {children}
    </Button>
  );
}
