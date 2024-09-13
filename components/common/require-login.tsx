'use client';

import React, { ReactNode } from 'react';

import LoginButton from '@/components/button/login-button';
import { useI18n } from '@/i18n/client';

export default function RequireLogin(): ReactNode {
  const t = useI18n();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2">
      <span className="text-lg font-bold">{t('require-login')}</span>
      <LoginButton className="w-fit min-w-[100px]" />
    </div>
  );
}
