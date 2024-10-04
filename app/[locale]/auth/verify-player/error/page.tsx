import Tran from '@/components/common/tran';
import React from 'react';

export default function page() {
  return (
    <div className="text-danger flex h-full flex-col items-center justify-center text-3xl font-bold">
      <Tran text="token.verification-failed" />
    </div>
  );
}
