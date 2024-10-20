import Tran from '@/components/common/tran';
import React from 'react';

export default function Page({ searchParams: { message } }: any) {
  return (
    <div className="flex h-full flex-col items-center justify-center p-8 text-destructive">
      <Tran className="text-danger text-3xl font-bold" text="token.verification-failed" />
      <p>{message}</p>
    </div>
  );
}
