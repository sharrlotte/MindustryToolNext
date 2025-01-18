import { InitOptions } from 'i18next';
import { ChainedBackendOptions } from 'i18next-chained-backend';
import HttpApi, { HttpBackendOptions } from 'i18next-http-backend';
import { unstable_cache } from 'next/cache';

import env from '@/constant/env';
import axiosInstance from '@/query/config/config';

export const defaultLocale = 'en';
export const cookieName = 'Locale';
export const locales = env.locales;

export type Locale = (typeof locales)[number];

export type TranslateFunction = (key: string, args?: Record<string, any>) => string;
export const defaultNamespace: string | string[] = ['common', 'tags'];

const getTranslationFn = typeof window !== 'undefined' ? (url: string) => axiosInstance.get(url) : unstable_cache((url: string) => axiosInstance.get(url), ['translations'], { revalidate: 3600 });

export function getOptions(lng = defaultLocale, ns = defaultNamespace) {
  const options: InitOptions<ChainedBackendOptions> = {
    // debug: process.env.NODE_ENV === 'development',
    supportedLngs: locales,
    fallbackLng: defaultLocale,
    lng,
    interpolation: {
      escapeValue: false,
    },
    fallbackNS: defaultNamespace,
    defaultNS: defaultNamespace,
    ns,
    react: {
      useSuspense: true,
    },
    backend: {
      backends: [HttpApi],
      backendOptions: [
        {
          loadPath: `${env.url.api}/translations/{{lng}}/{{ns}}`,
          request(options, url, payload, callback) {
            getTranslationFn(url)
              .then((result) => callback(undefined, { status: 200, data: result.data }))
              .catch((error) => callback(error, undefined));
          },
          requestOptions: {
            next: {
              revalidate: 600,
            },
          },
          alternateFetch: fetch,
        } as HttpBackendOptions,
      ],
    },
  };

  return options;
}
