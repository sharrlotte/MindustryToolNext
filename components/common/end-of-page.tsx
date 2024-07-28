import React from 'react';

import { useI18n } from '@/locales/client';

export default function EndOfPage() {
  const t = useI18n();
  
  return (
    <span
      className="col-span-full flex w-full items-center justify-center"
      key="End"
    >
      {t('end-of-page')}
    </span>
  );
}
