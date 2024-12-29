import { BackendModule, InitOptions, ReadCallback, ResourceLanguage } from 'i18next';
import { ChainedBackendOptions } from 'i18next-chained-backend';
import HttpApi, { HttpBackendOptions } from 'i18next-http-backend';
import { use } from 'react';

import env from '@/constant/env';

export const defaultLocale = 'en';
export const cookieName = 'Locale';
export const locales = env.locales;

export type Locale = (typeof locales)[number];

export type TranslateFunction = (key: string, args?: Record<string, any>) => string;
export const defaultNamespace: string | string[] = ['common', 'tags'];

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
      backends: [typeof window === 'undefined' ? CBackend : HttpApi],
      backendOptions: [
        {
          loadPath: `${env.url.api}/translations/{{lng}}/{{ns}}`,
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

class CBackend implements BackendModule<any> {
  type: 'backend' = 'backend';

  init(services?: any, options?: HttpBackendOptions): void {}
  read(language: string, namespace: string, callback: ReadCallback): void {
    const result = fetch(`${env.url.api}/translations/${language}/${namespace}`).then((r) => r.json());

    const data = use(result);

    callback(null, data);
  }
}
