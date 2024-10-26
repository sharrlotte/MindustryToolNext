export const defaultLocale = 'en';
export const locales = ['en', 'vi', 'kr', 'cn', 'jp', 'ru', 'uk'] as const;

export type Locale = (typeof locales)[number];

export type TranslateFunction = (key: string, args?: Record<string, any>) => string;
