'use client';

import React from 'react';

import Markdown from '@/components/markdown/markdown';

import { useI18n } from '@/i18n/client';

export default function RulePage() {
  const t = useI18n();

  return (
    <main className="flex h-full w-full items-center justify-center">
      <Markdown>{t('rule.content')}</Markdown>
    </main>
  );
}
