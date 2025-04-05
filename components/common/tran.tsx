'use client';

import React from 'react';

import { useI18n } from '@/i18n/client';
import { extractTranslationKey } from '@/lib/utils';

type Props = {
  className?: string;
  text: string;
  style?: React.CSSProperties;
  args?: Record<string, any>;
  asChild?: boolean;
  defaultValue?: string;
};

export default function Tran({ className, text, args = {}, asChild, defaultValue, ...rest }: Props): React.ReactNode {
  const { group, key } = extractTranslationKey(text);
  const { t } = useI18n(group);

  if (asChild) {
    return t(key, { ...args, defaultValue });
  }

  return (
    <span className={className} {...rest}>
      {t(key, { ...args, defaultValue })}
    </span>
  );
}

