'use client';

import React from 'react';

import { useI18n } from '@/i18n/client';
import { cn } from '@/lib/utils';

function _TagName({
  className,
  children,
}: {
  className?: string;
  children: string;
}) {
  const t = useI18n();

  return (
    <span className={cn('capitalize', className)}>{t(`tags.${children}`)}</span>
  );
}

export const TagName = React.memo(_TagName);
