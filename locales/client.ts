'use client';

import { createI18nClient } from 'next-international/client';
import { useCallback } from 'react';

import { TranslateFunction } from '@/i18n/config';
import { useLocaleStore } from '@/zustand/locale-store';
import useClientApi from '@/hooks/use-client';

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
  const { keys, setKeys } = useLocaleStore();
  const axios = useClientApi();

  return useCallback(
    (text: string, args?: Record<string, string>) => {
      if (!text) {
        throw new Error('Bad key');
      }

      const parts = text.split('.');

      if (parts.length === 0) {
        throw new Error('Bad key');
      }

      const group = parts.length === 1 ? 'common' : parts[0];
      const key = parts.length === 1 ? parts[0] : parts[1];

      const value = keys[group];

      if (value === undefined) {
        keys[group] = {};

        axios
          .get('/translations', {
            params: {
              group,
            },
          })
          .then((result) => {
            setKeys({ [group]: result.data });
          });
      }

      return value ? (value[key] ?? text) : text;
    },
    [axios, keys, setKeys],
  );
}

export {
  I18nProviderClient,
  useI18n,
  useScopedI18n,
  useChangeLocale,
  useCurrentLocale,
};
