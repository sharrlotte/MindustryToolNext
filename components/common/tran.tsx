'use client';

import React from 'react';

import { useI18n } from '@/i18n/client';

type Props = {
  className?: string;
  text: string;
  args?: Record<string, any>;
};

export default function Tran({
  className,
  text,
  args,
}: Props): React.ReactNode {
  const t = useI18n();
  return <span className={className}>{t(text, args)}</span>;
}
