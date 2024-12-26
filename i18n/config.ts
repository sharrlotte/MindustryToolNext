import { InitOptions } from 'i18next';
import { ChainedBackendOptions } from 'i18next-chained-backend';
import HttpApi from 'i18next-http-backend';

import env from '@/constant/env';

export const defaultLocale = 'en';
export const cookieName = 'Locale';
export const locales = env.locales;

export type Locale = (typeof locales)[number];

export type TranslateFunction = (key: string, args?: Record<string, any>) => string;
export const defaultNamespace = 'comment';

export function getOptions(lng = defaultLocale, ns = defaultNamespace) {
  const options: InitOptions<ChainedBackendOptions> = {
    debug: process.env.NODE_ENV === 'development',
    supportedLngs: locales,
    fallbackLng: defaultLocale,
    lng,
    fallbackNS: defaultNamespace,
    defaultNS: defaultNamespace,
    ns,
    backend: {
      backends: [HttpApi],
      backendOptions: [{ loadPath: `${env.url.api}/translations/{{lng}}/{{ns}}` }],
    },
  };

  return options;
}
