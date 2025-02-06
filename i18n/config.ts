import { InitOptions } from 'i18next';
import { ChainedBackendOptions } from 'i18next-chained-backend';
import HttpApi, { HttpBackendOptions } from 'i18next-http-backend';
import LocalStorageBackend from 'i18next-localstorage-backend';
import { unstable_cache } from 'next/cache';

import env from '@/constant/env';
import axiosInstance from '@/query/config/config';

export const defaultLocale = 'en';
export const cookieName = 'Locale';
export const locales = env.locales;

export type Locale = (typeof locales)[number];

export type TranslateFunction = (key: string, args?: Record<string, any>) => string;
export const defaultNamespace: string | string[] = ['common', 'tags'];

const getTranslationFn = unstable_cache(async (url: string) => await axiosInstance.get(url).then((res) => res.data), ['server-translations'], { revalidate: 3600 });

export function getClientOptions(lng = defaultLocale, ns = defaultNamespace) {
  const options: InitOptions<ChainedBackendOptions> = {
    // debug: process.env.NODE_ENV === 'development',
    supportedLngs: locales,
    lng,
    interpolation: {
      escapeValue: false,
    },
    saveMissing: true,
    fallbackLng: defaultLocale,
    fallbackNS: defaultNamespace,
    defaultNS: defaultNamespace,
    ns,
    backend: {
      backends: [LocalStorageBackend, HttpApi],
      backendOptions: [
        {
          expirationTime: 24 * 60 * 60 * 1000, // 7 days
        },
        {
          loadPath: `${env.url.api}/translations/{{lng}}/{{ns}}`,
          addPath: `${env.url.api}/translations/{{lng}}/{{ns}}`,
          requestOptions: {
            next: {
              revalidate: 600,
            },
          },
        } as HttpBackendOptions,
      ],
    },
  };

  return options;
}

export function getServerOptions(lng = defaultLocale, ns = defaultNamespace) {
  const options: InitOptions<ChainedBackendOptions> = {
    // debug: process.env.NODE_ENV === 'development',
    supportedLngs: locales,
    lng,
    saveMissing: true,
    interpolation: {
      escapeValue: false,
    },
    fallbackLng: defaultLocale,
    fallbackNS: defaultNamespace,
    defaultNS: defaultNamespace,
    ns,
    backend: {
      backends: [HttpApi],
      backendOptions: [
        {
          loadPath: `${env.url.api}/translations/{{lng}}/{{ns}}`,
          addPath: `${env.url.api}/translations/{{lng}}/{{ns}}`,
          request(options, url, payload, callback) {
            getTranslationFn(url)
              .then((result) => callback(undefined, { status: 200, data: result }))
              .catch((error) => callback(error, undefined));
          },
          requestOptions: {
            next: {
              revalidate: 600,
            },
          },
        } as HttpBackendOptions,
      ],
    },
  };

  return options;
}
