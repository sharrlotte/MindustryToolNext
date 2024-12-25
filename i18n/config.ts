import env from "@/constant/env";

export const defaultLocale = 'en';
export const cookieName = 'Locale';
export const locales = ['en', 'vi', 'kr', 'cn', 'jp', 'ru', 'uk'] as const;

export type Locale = (typeof locales)[number];

export type TranslateFunction = (key: string, args?: Record<string, any>) => string;
export const defaultNamespace = 'comment'


export function getOptions (lng = defaultLocale, ns = defaultNamespace) {
  return {
    // debug: true,
    supportedLngs: locales,
    fallbackLng: defaultLocale,
    lng,
    fallbackNS: defaultNamespace,
    defaultNS: defaultNamespace,
    ns,
    loadPath: `${env.url.api }/translation/{{lng}}/{{ns}}`,
  }
}
