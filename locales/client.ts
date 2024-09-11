'use client';

import { createI18nClient } from 'next-international/client';
import { useCallback } from 'react';

import { TranslateFunction } from '@/i18n/config';

const {
  useI18n: defaultUseI18n,
  useScopedI18n,
  useChangeLocale,
  I18nProviderClient,
  useCurrentLocale,
} = createI18nClient(
  {
    en: () => import('./en'),
    vi: () => import('./vi'),
  },
  {
    fallbackLocale: {
      vi: 'en',
    },
  },
);

export const locales = ['en', 'vi'] as const;

export type Locale = (typeof locales)[number];

function useI18n(): TranslateFunction {
  const t = defaultUseI18n();

  return useCallback(
    (key: string, args?: Record<string, string>) => {
      const parts = key.split('.');

      if (parts.length === 0) {
        throw new Error('Bad key');
      }
      //@ts-expect-error fix later
      return t(key, args);
    },
    [t],
  );
}

export {
  I18nProviderClient,
  useI18n,
  useScopedI18n,
  useChangeLocale,
  useCurrentLocale,
};
