'use client';

import React from 'react';

import { useI18n } from '@/locales/client';

type Props = {
  className?: string;
  text: string;
};

export default function Tran({ className, text }: Props): React.ReactNode {
  const t = useI18n();
  return <span className={className}>{t(text)}</span>;
}
