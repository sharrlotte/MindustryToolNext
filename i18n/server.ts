import { createInstance } from 'i18next';
import { InitOptions } from 'i18next';
import Backend from 'i18next-chained-backend';
import { ChainedBackendOptions } from 'i18next-chained-backend';
import HttpApi, { HttpBackendOptions } from 'i18next-http-backend';
import { cache } from 'react';
import { initReactI18next } from 'react-i18next/initReactI18next';

import env from '@/constant/env';
import { Locale, defaultLocale, defaultNamespace, locales } from '@/i18n/config';
import axiosInstance from '@/query/config/config';

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
					addPath: `${env.url.api}/translations/{{lng}}/{{ns}}/create-missing`,

					request(options, url, payload, callback) {
						if (url.includes('create-missing')) {
							axiosInstance
								.post(url, payload, { data: payload })
								.then((result) => callback(undefined, { status: 200, data: result }))
								.catch((error) => callback(error, undefined));
						} else {
							fetch(url, {
								headers: {
									Server: 'true',
								},
								next: {
									tags: ['server-translations'],
									revalidate: 3600,
								},
							})
								.then(async (result) => {
									if (result.ok) callback(undefined, { status: 200, data: await result.json() });
									else callback(result.statusText, undefined);
								})
								.catch((error) => callback(error, undefined));
						}
					},
				} as HttpBackendOptions,
			],
		},
	};

	return options;
}

const initI18next = async (language: Locale, namespace?: string | string[]) => {
	const i18nInstance = createInstance();
	await i18nInstance
		.use(initReactI18next) //
		.use(Backend)
		.init<ChainedBackendOptions>(getServerOptions(language, namespace));

	return i18nInstance;
};

export const getTranslation = cache(
	async (locale: Locale, namespace: string | string[] = 'common', options: { keyPrefix?: string } = {}) => {
		const language = locales.includes(locale as any) ? locale : defaultLocale;

		const i18nextInstance = await initI18next(language, namespace);

		return {
			t: i18nextInstance.getFixedT(language, namespace, options.keyPrefix),
			i18n: i18nextInstance,
		};
	},
);
