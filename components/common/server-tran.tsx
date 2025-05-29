import React from 'react';

import { Locale } from '@/i18n/config';
import { getTranslation } from '@/i18n/server';
import { extractTranslationKey } from '@/lib/i18n.utils';

type Props = {
  className?: string;
  text: string;
  locale: Locale;
  style?: React.CSSProperties;
  args?: Record<string, any>;
  asChild?: boolean;
};

export default async function ServerTran({ className, locale, text, args, asChild, ...rest }: Props) {
  const { group, key } = extractTranslationKey(text);
  const { t } = await getTranslation(locale, group);

  if (asChild) {
    return t(key, args);
  }

  return (
    <span className={className} {...rest}>
      {t(key, args)}
    </span>
  );
}
