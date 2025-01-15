import { createStore } from 'zustand';

import { Locale, locales } from '@/i18n/config';

export type TranslationGroup = Record<string, Record<string, string>>;
export type LocaleData = Record<string, TranslationGroup>;

type State = {
  currentLocale: Locale;
  setCurrentLocale: (value: Locale) => void;
};

export const createServerStore = (currentLocale: Locale = 'en') => {
  return createStore<State>()((set) => ({
    currentLocale: locales.includes(currentLocale) ? currentLocale : 'en',
    setCurrentLocale: (value: Locale) => set({ currentLocale: locales.includes(value) ? value : 'en' }),
  }));
};
