'use client';

import React from 'react';

import LoginButton from '@/components/button/login-button';
import { useI18n } from '@/locales/client';

export default function RequireLogin() {
  const t = useI18n();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2">
      <span className="font-bold text-lg">{t('require-login')}</span>
      <LoginButton className="min-w-[100px] w-fit" />
    </div>
  );
}
