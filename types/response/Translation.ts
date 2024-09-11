import { Locale } from '@/locales/client';

export type TranslationDiff = {
  key: string;
  value: string;
  keyGroup: string;
};

export type TranslationCompare = {
  key: string;
  value: Record<Locale, string>;
  keyGroup: string;
};
