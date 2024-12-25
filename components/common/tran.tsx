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
};

function InternalTran({ className, text, args, asChild, ...rest }: Props): React.ReactNode {
  const { group, key } = extractTranslationKey(text);
  const { t } = useI18n(group);

  if (asChild) {
    return t(key, args);
  }

  return (
    <span className={className} {...rest}>
      {t(key, args)}
    </span>
  );
}

const Tran = React.memo(InternalTran);

export default Tran;
