'use client';

import Markdown from '@/components/common/markdown';
import { useI18n } from '@/i18n/client';
import React from 'react';

export default function Page() {
  const t = useI18n();

  return (
    <main className="flex h-full w-full items-center justify-center">
      <Markdown>{t('rule.content')}</Markdown>
    </main>
  );
}
