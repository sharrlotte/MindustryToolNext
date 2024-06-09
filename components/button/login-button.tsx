'use client';

import React from 'react';

import env from '@/constant/env';
import { cn } from '@/lib/utils';
import { useI18n } from '@/locales/client';

import { ArrowRightEndOnRectangleIcon } from '@heroicons/react/24/outline';

export default function LoginButton({ className }: { className?: string }) {
  const t = useI18n();

  return (
    <a
      className={cn('flex w-full gap-2 rounded-md border p-2', className)}
      href={`${env.url.api}/oauth2/discord`}
    >
      <ArrowRightEndOnRectangleIcon className="h-5 w-5" />
      {t('login')}
    </a>
  );
}
