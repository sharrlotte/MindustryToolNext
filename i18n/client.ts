'use client';

import { useCallback } from 'react';

import { useLocaleStore } from '@/zustand/locale-store';
import useClientApi from '@/hooks/use-client';
import { Locale, locales, TranslateFunction } from '@/i18n/config';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCookies } from 'react-cookie';

function useI18n(): TranslateFunction {
  const { currentLocale, translation, setTranslation } = useLocaleStore();
  const axios = useClientApi();

  if (!translation[currentLocale]) {
    translation[currentLocale] = {};
  }
  const keys = translation[currentLocale];

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

      text = `${group}.${key}`;

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
            setTranslation({ [group]: result.data });
          });
      }

      return value ? (format(value[key], args) ?? text) : text;
    },
    [axios, keys, setTranslation],
  );
}

function format(text: string, args?: Record<string, string>) {
  if (!args || !text) {
    return text;
  }

  Object.entries(args).forEach(([key, value]) => {
    text = text.replace(`${key}`, value);
  });

  return text;
}

export function useChangeLocale() {
  const [_, setCookie] = useCookies();
  const { setCurrentLocale } = useLocaleStore();
  const pathname = usePathname();
  const router = useRouter();
  const params = useSearchParams();

  return (locale: Locale) => {
    const pathnameHasLocale = locales.some(
      (locale) =>
        pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
    );

    const url = pathnameHasLocale
      ? `/${locale}/${pathname.slice(4)}`
      : `/${locale}${pathname}`;

    setCurrentLocale(locale);
    setCookie('Next-Locale', locale, { path: '/' });

    router.push(`${url}?${new URLSearchParams(params).toString()}`);
  };
}

export { useI18n };
