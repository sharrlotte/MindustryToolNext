'use client';

import i18next from 'i18next';
import React, { useEffect, useRef } from 'react';
import { I18nextProvider } from 'react-i18next';
import Moment from 'react-moment';
import { useStore } from 'zustand';

import { Locale } from '@/i18n/config';
import axiosInstance from '@/query/config/config';
import { createServerStore } from '@/zustand/locale-store';

export type TranslationGroup = Record<string, Record<string, string>>;
export type LocaleData = Record<string, TranslationGroup>;
type Props = { locale: Locale; children: React.ReactNode };

type ContextType = ReturnType<typeof createServerStore>;

const Context = React.createContext<ContextType | undefined>(undefined);

export function useLocaleStore() {
  const value = React.useContext(Context);

  if (!value) {
    throw new Error('Can not use out side of context');
  }

  return useStore(value);
}

export default function I18nProvider({ locale, children }: Props) {
  const storeRef = useRef<ContextType>();

  Moment.globalLocale = locale;

  if (!storeRef.current) {
    storeRef.current = createServerStore(locale);
  }

  useEffect(() => {
    axiosInstance.defaults.headers['Accept-Language'] = locale as string;
  }, [locale]);

  return (
    <Context.Provider value={storeRef.current}>
      <I18nextProvider i18n={i18next} defaultNS={'common'}>
        {children}
      </I18nextProvider>
    </Context.Provider>
  );
}
