import { Locale } from '@/i18n/config';
import { create } from 'zustand';

type TranslationGroup = Record<string, Record<string, string>>;
type LocaleData = Record<string, TranslationGroup>;

type State = {
  isCurrentLocaleSet: boolean;
  currentLocale: Locale;
  translation: LocaleData;
  setCurrentLocale: (value: Locale) => void;
  setTranslation: (data: TranslationGroup) => void;
};

export const useLocaleStore = create<State>((set) => ({
  currentLocale: 'en',
  isCurrentLocaleSet: false,
  translation: {},
  setCurrentLocale: (value: Locale) =>
    set({ isCurrentLocaleSet: true, currentLocale: value }),
  setTranslation: (value: TranslationGroup) => {
    set((prev) => ({
      translation: {
        [prev.currentLocale]: {
          ...prev.translation[prev.currentLocale],
          ...value,
        },
      },
    }));
  },
}));
