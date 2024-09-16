export const defaultLocale = 'en';
export const locales = ['en', 'vi', 'kr', 'cn'] as const;

export type Locale = (typeof locales)[number];

export type TranslateFunction = (
  key: string,
  args?: Record<string, any>,
) => string;
