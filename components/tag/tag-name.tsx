'use client';

import React from 'react';

import { useI18n } from '@/i18n/client';
import { cn } from '@/lib/utils';

function InternalTagName({
  className,
  children,
}: {
  className?: string;
  children: string;
}) {
  const t = useI18n();

  return (
    <span className={cn('capitalize text-sx', className)}>{t(`tags.${children}`)}</span>
  );
}

export const TagName = React.memo(InternalTagName);
