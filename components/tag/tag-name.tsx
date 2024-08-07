'use client';

import React from 'react';

import { useI18n } from '@/locales/client';

export default function TagName({ children }: { children: string }) {
  const t = useI18n();

  return <span className="capitalize">{t(children)}</span>;
}
