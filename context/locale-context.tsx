'use client';

import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';

import { Locale, locales } from '@/i18n/config';
import axiosInstance from '@/query/config/config';

export type TranslationGroup = Record<string, Record<string, string>>;
export type LocaleData = Record<string, TranslationGroup>;

interface LocaleContextType {
  currentLocale: Locale;
  setCurrentLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

type I18nProviderProps = {
  locale: Locale;
  children: ReactNode;
};

export function I18nProvider({ locale, children }: I18nProviderProps): JSX.Element {
  const [currentLocale, setCurrentLocaleState] = useState<Locale>(locales.includes(locale) ? locale : 'en');

  const setCurrentLocale = (newLocale: Locale) => {
    if (locales.includes(newLocale)) {
      setCurrentLocaleState(newLocale);
    } else {
      console.warn(`Invalid locale "${newLocale}", defaulting to 'en'.`);
      setCurrentLocaleState('en');
    }
  };

  useEffect(() => {
    axiosInstance.defaults.headers['Accept-Language'] = currentLocale;
  }, [currentLocale]);

  const value: LocaleContextType = {
    currentLocale,
    setCurrentLocale,
  };

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocaleStore(): LocaleContextType {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocaleStore must be used within an I18nProvider');
  }
  return context;
}
