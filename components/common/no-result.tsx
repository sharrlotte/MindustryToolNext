'use client';

import { cn } from '@/lib/utils';
import { useI18n } from '@/locales/client';

import React, { HTMLAttributes } from 'react';

type NoResultProps = HTMLAttributes<HTMLDivElement>;

export default function NoResult({ className }: NoResultProps) {
  const t = useI18n();
  return <div className={cn(className)}>{t('no-result')}</div>;
}
