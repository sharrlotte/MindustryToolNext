import { createStore } from 'zustand';

import { Locale, locales } from '@/i18n/config';

export type TranslationGroup = Record<string, Record<string, string>>;
export type LocaleData = Record<string, TranslationGroup>;

type State = {
  currentLocale: Locale;
  translation: LocaleData;
  setCurrentLocale: (value: Locale) => void;
  setTranslation: (data: TranslationGroup) => void;
};

export const createServerStore = (currentLocale: Locale = 'en') => {
  return createStore<State>()((set) => ({
    currentLocale: locales.includes(currentLocale) ? currentLocale : 'en',
    setCurrentLocale: (value: Locale) => set({ currentLocale: locales.includes(value) ? value : 'en' }),
    translation: { [currentLocale]: {} },
    setTranslation: (data: TranslationGroup) => {
      set((prev) => ({
        translation: {
          [prev.currentLocale]: {
            ...prev.translation[prev.currentLocale],
            ...data,
          },
        },
      }));
    },
  }));
};
