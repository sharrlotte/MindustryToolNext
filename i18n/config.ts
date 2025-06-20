import env from '@/constant/env';

export const defaultLocale = 'en';
export const cookieName = 'Locale';
export const locales = env.locales;
export const i18nCachePrefix = 'i18next-';

export type Locale = (typeof locales)[number];

export type TranslateFunction = (key: string, args?: Record<string, any>) => string;

export const defaultNamespace: string | string[] = 'common';
