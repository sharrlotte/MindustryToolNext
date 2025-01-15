'use client';

import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-chained-backend';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { initReactI18next, useTranslation as useTranslationOrg } from 'react-i18next';

import { Locale, cookieName, defaultLocale, getOptions, locales } from '@/i18n/config';

const runsOnServerSide = typeof window === 'undefined';

//
i18next
  .use(LanguageDetector)
  .use(Backend)
  .use(initReactI18next)
  .init({
    ...getOptions(),
    lng: undefined, // let detect the language on client side
    detection: {
      order: ['path'],
    },
    preload: runsOnServerSide ? locales : [],
  });

export default i18next;

export function useI18n(namespace: string | string[] = 'common', options?: any) {
  const { locale } = useParams();

  let language = String(locale);

  language = locales.includes(language as any) ? language : defaultLocale;

  const [cookies, setCookie] = useCookies([cookieName]);
  const ret = useTranslationOrg(namespace, options);

  const { i18n } = ret;
  if (runsOnServerSide && language && i18n.resolvedLanguage !== language) {
    i18n.changeLanguage(language);
  } else {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [activeLng, setActiveLng] = useState(i18n.resolvedLanguage);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (activeLng === i18n.resolvedLanguage) return;
      console.log(['active', activeLng, i18n.resolvedLanguage]);
      setActiveLng(i18n.resolvedLanguage);
    }, [activeLng, i18n.resolvedLanguage]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (!language || i18n.resolvedLanguage === language) return;
      i18n.changeLanguage(language);
      console.log(['active', language, i18n.resolvedLanguage]);

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [language, i18n.resolvedLanguage]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (cookies[cookieName] === language) return;
      console.log(['active', language, cookies[cookieName]]);

      setCookie(cookieName, language, { path: '/' });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [language, cookies[cookieName]]);
  }
  return ret;
}

export function useChangeLocale() {
  const [_, setCookie] = useCookies();
  const pathname = usePathname();
  const router = useRouter();
  const params = useSearchParams();

  return (locale: Locale) => {
    const pathnameHasLocale = locales.some((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`);

    const url = pathnameHasLocale ? `/${locale}/${pathname.slice(4)}` : `/${locale}${pathname}`;

    setCookie('Locale', locale, { path: '/' });

    router.push(`${url}?${new URLSearchParams(params).toString()}`);
  };
}
