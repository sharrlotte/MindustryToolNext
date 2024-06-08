'use client';

import { cn } from '@/lib/utils';
import { useI18n } from '@/locales/client';

import React, { HTMLAttributes } from 'react';

type NoMoreProps = HTMLAttributes<HTMLDivElement>;

export default function NoMore({ className }: NoMoreProps) {
  const t = useI18n();

  return <div className={cn(className)}>{t('no-more')}</div>;
}
