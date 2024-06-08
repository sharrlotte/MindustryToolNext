'use client';

import { useI18n } from '@/locales/client';

import React from 'react';

export default function TagName({ children }: { children: string }) {
  const t = useI18n();

  //@ts-ignore
  return <span>{t(children)}</span>;
}
