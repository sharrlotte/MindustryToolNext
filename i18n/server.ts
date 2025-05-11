import { createInstance } from 'i18next';
import { InitOptions } from 'i18next';
import HttpApi, { HttpBackendOptions } from 'i18next-http-backend';
import { unstable_cache } from 'next/cache';
import { cache } from 'react';
import { initReactI18next } from 'react-i18next/initReactI18next';

import env from '@/constant/env';
import { Locale, defaultLocale, defaultNamespace, locales } from '@/i18n/config';
import axiosInstance from '@/query/config/config';

const getTranslationCached = cache(
	unstable_cache(
		(url: string) =>
			axiosInstance
				.get(url, {
					headers: {
						Server: 'true',
					},
				})
				.then((res) => res.data),
		['translations'],
		{
			revalidate: 3600,
		},
	),
);

export function getServerOptions(lng = defaultLocale, ns = defaultNamespace) {
	const options: InitOptions<HttpBackendOptions> = {
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
		preload: locales,
		backend: {
			loadPath: `${env.url.api}/translations/{{lng}}/{{ns}}`,
			addPath: `${env.url.api}/translations/{{lng}}/{{ns}}/create-missing`,
			request(options, url, payload, callback) {
				if (url.includes('create-missing')) {
					axiosInstance
						.post(url, payload, { data: payload })
						.then((result) => callback(undefined, { status: 200, data: result }))
						.catch((error) => callback(error, undefined));
				} else {
					getTranslationCached(url)
						.then((result) => callback(undefined, { status: 200, data: result }))
						.catch((error) => callback(error, undefined));
				}
			},
		},
	};

	return options;
}

const initI18next = async (language: Locale, namespace?: string | string[]) => {
	const i18nInstance = createInstance();
	await i18nInstance
		.use(initReactI18next) //
		.use(HttpApi)
		.init<HttpBackendOptions>(getServerOptions(language, namespace));

	return i18nInstance;
};

export const getTranslation = async (
	locale: Locale,
	namespace: string | string[] = 'common',
	options: { keyPrefix?: string } = {},
) => {
	const language = locales.includes(locale as any) ? locale : defaultLocale;
	namespace = Array.isArray(namespace) ? namespace.map((n) => n.toLowerCase()) : namespace.toLowerCase();

	const i18nextInstance = await initI18next(language, namespace);
	const t = i18nextInstance.getFixedT(language, namespace, options.keyPrefix);

	return {
		t: (key: string, options?: any) => t(key.toLowerCase(), options) as string,
		i18n: i18nextInstance,
	};
};
