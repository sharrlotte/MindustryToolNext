'use client';

import { createI18nClient } from 'next-international/client';

const {
  useI18n,
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

export {
  I18nProviderClient,
  useI18n,
  useScopedI18n,
  useChangeLocale,
  useCurrentLocale,
};
