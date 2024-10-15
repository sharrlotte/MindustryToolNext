'use client';

import React, { ReactNode } from 'react';

import LoginButton from '@/components/button/login-button';
import Tran from '@/components/common/tran';

export default function RequireLogin(): ReactNode {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2">
      <span className="text-lg font-bold">
        <Tran text="require-login" />
      </span>
      <LoginButton className="w-fit min-w-[100px]" />
    </div>
  );
}
