'use client';

import { Locale } from '@/i18n/config';
import { useLocaleStore } from '@/zustand/locale-store';
import { useEffect } from 'react';

type Props = { locale: Locale };

export default function I18nProvider({ locale }: Props) {
  const { setCurrentLocale } = useLocaleStore();

  useEffect(() => {
    setCurrentLocale(locale);
  }, [locale, setCurrentLocale]);

  return undefined;
}
