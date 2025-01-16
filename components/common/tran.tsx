'use client';

import React, { Suspense } from 'react';

import { useI18n } from '@/i18n/client';
import { extractTranslationKey } from '@/lib/utils';

type Props = {
  className?: string;
  text: string;
  style?: React.CSSProperties;
  args?: Record<string, any>;
  asChild?: boolean;
};

function ITran({ className, text, args, asChild, ...rest }: Props): React.ReactNode {
  const { group, key } = extractTranslationKey(text);
  const { t } = useI18n(group);

  console.log(text);

  if (asChild) {
    return t(key, args);
  }

  return (
    <span className={className} {...rest}>
      {t(key, args)}
    </span>
  );
}

export default function Tran(props: Parameters<typeof ITran>[0]) {
  return (
    <Suspense>
      <ITran {...props} />
    </Suspense>
  );
}
