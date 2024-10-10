import Tran from '@/components/common/tran';
import React from 'react';

export default function Page() {
  return (
    <div className="flex h-full items-center justify-center text-3xl font-bold text-success">
      <Tran text="token.verified" />
      <Tran text="token.you-can-go-back-to-game-now" />
    </div>
  );
}
