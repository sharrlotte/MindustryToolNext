'use client';

import { Locale } from '@/i18n/config';
import axiosInstance from '@/query/config/config';
import React, { useEffect, useState } from 'react';

type TranslationGroup = Record<string, Record<string, string>>;
type LocaleData = Record<string, TranslationGroup>;
type Props = { locale: Locale; children: React.ReactNode };

type State = {
  currentLocale: Locale;
  translation: LocaleData;
  setCurrentLocale: (value: Locale) => void;
  setTranslation: (data: TranslationGroup) => void;
};

const DEFAULT_STATE: State = {
  currentLocale: 'en',
  translation: {},
  setCurrentLocale: (_: Locale) => {},
  setTranslation: (_: TranslationGroup) => {},
};

const Context = React.createContext<State>(DEFAULT_STATE);

export function useLocaleStore() {
  const value = React.useContext(Context);

  if (!value) {
    return DEFAULT_STATE;
  }

  return value;
}

export default function I18nProvider({ locale, children }: Props) {
  const [currentLocale, setCurrentLocale] = useState<Locale>(locale);
  const [translation, _setTranslation] = useState<LocaleData>({});

  useEffect(() => {
    setCurrentLocale(locale);
  }, [locale, setCurrentLocale]);

  useEffect(() => {
    axiosInstance.defaults.headers['Accept-Language'] = locale as string;
  }, [locale]);

  function setTranslation(value: TranslationGroup) {
    _setTranslation((prev) => ({
      [currentLocale]: {
        ...prev[currentLocale],
        ...value,
      },
    }));
  }

  return <Context.Provider value={{ currentLocale, setCurrentLocale, translation, setTranslation }}>{children}</Context.Provider>;
}
