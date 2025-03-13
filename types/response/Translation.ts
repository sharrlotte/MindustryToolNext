import { Locale } from '@/i18n/config';

export type TranslationDiff = {
  id: string;
  key: string;
  value: string;
  keyGroup: string;
};

export type TranslationCompare = {
  id: string;
  key: string;
  value: Record<Locale, string>;
  keyGroup: string;
};

export type Translation = {
  id: string;
  key: string;
  value: string;
  keyGroup: string;
  isTranslated?: boolean;
};
