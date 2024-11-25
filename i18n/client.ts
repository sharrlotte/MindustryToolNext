import { unstable_cache } from 'next/cache';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { cache, use, useCallback } from 'react';
import { useCookies } from 'react-cookie';

import { useLocaleStore } from '@/context/locale-context';
import { Locale, TranslateFunction, locales } from '@/i18n/config';
import { extractTranslationKey, formatTranslation } from '@/lib/utils';
import axiosInstance from '@/query/config/config';

const EMPTY = {};

const getClientTranslation = cache((group: string, language: string) =>
  axiosInstance
    .get('/translations', {
      params: {
        group,
        language,
      },
    })
    .then(({ data }) => data)
    .catch((err) => console.error(err)),
);

const getServerTranslation = unstable_cache(
  (group: string, language: string) =>
    axiosInstance
      .get('/translations', {
        params: {
          group,
          language,
        },
        timeout: 1000,
      })
      .then(({ data }) => data)
      .catch((err) => console.error(err)),
  ['translations'],
  { revalidate: 3600 },
);

export function useI18n(): TranslateFunction {
  const { currentLocale, translation, setTranslation } = useLocaleStore();

  if (translation[currentLocale] === undefined) {
    translation[currentLocale] = {};
  }

  const keys = translation[currentLocale];

  const t = useCallback(
    (translationKey: string, args?: Record<string, string>) => {
      const { text, group, key } = extractTranslationKey(translationKey);

      let value = keys[group];

      const localStorageKey = `${currentLocale}.translation.${group}`;

      if (value === undefined) {
        try {
          value = JSON.parse(localStorage.getItem(localStorageKey) || 'null');
          keys[group] = value;
        } catch (e) {
          keys[group] = EMPTY;
          localStorage.removeItem(localStorageKey);
        }

        value = keys[group];

        if (value === null) {
          getClientTranslation(group, currentLocale) //
            .then((result) => {
              if (result) {
                localStorage.setItem(localStorageKey, JSON.stringify(result));

                keys[group] = result;

                setTranslation({ [group]: result });
              }
            });
        }
      }

      if (!value || Object.keys(value).length === 0) {
        return text;
      }

      const translated = value[key];

      if (!translated) {
        console.warn(`Missing key: ${text}`);
        return text;
      }

      return formatTranslation(translated, args) || text;
    },
    [keys, currentLocale, setTranslation],
  );

  if (typeof window === 'undefined') {
    return (translationKey: string, args?: Record<string, string>) => {
      const { text, group, key } = extractTranslationKey(translationKey);

      try {
        const data = getServerTranslation(group, currentLocale);
        const value = use(data);

        if (!value) {
          return text;
        }

        const translated = value[key];

        return formatTranslation(translated, args) || text;
      } catch (err) {
        if (err && typeof err === 'object' && 'error' in err) {
          console.info(err);
          return text;
        }

        // Rethrow for react suspend error
        throw err;
      }
    };
  }

  return t;
}

export function useChangeLocale() {
  const [_, setCookie] = useCookies();
  const { setCurrentLocale } = useLocaleStore();
  const pathname = usePathname();
  const router = useRouter();
  const params = useSearchParams();

  return (locale: Locale) => {
    const pathnameHasLocale = locales.some((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`);

    const url = pathnameHasLocale ? `/${locale}/${pathname.slice(4)}` : `/${locale}${pathname}`;

    setCurrentLocale(locale);
    setCookie('Locale', locale, { path: '/' });

    router.push(`${url}?${new URLSearchParams(params).toString()}`);
  };
}
