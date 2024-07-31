'use client';

import React from 'react';

import { useI18n } from '@/locales/client';

type Props = {
  text: string;
};

export default function Tran({ text }: Props): React.ReactNode {
  const t = useI18n();
  // @ts-ignore
  return <span>{t(text)}</span>;
}
