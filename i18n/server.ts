import { createInstance } from 'i18next';
import { InitOptions } from 'i18next';
import HttpApi, { HttpBackendOptions } from 'i18next-http-backend';
import { cache } from 'react';
import { initReactI18next } from 'react-i18next/initReactI18next';

import env from '@/constant/env';
import { Locale, defaultLocale, defaultNamespace, locales } from '@/i18n/config';

const getTranslationCached = cache((url: string) =>
	fetch(url, {
		headers: {
			Server: 'true',
		},
		cache: 'force-cache',
		next: {
			revalidate: 3600,
			tags: ['translations'],
		},
		signal: AbortSignal.timeout(5000),
	}).then(async (res) => {
		if (!res.ok) {
			throw new Error('Failed to fetch data');
		}

		return await res.json();
	}),
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
		backend: {
			loadPath: `${env.url.api}/translations/{{lng}}/{{ns}}?v=1`,
			addPath: `${env.url.api}/translations/{{lng}}/{{ns}}/create-missing`,
			request(options, url, payload, callback) {
				if (url.includes('create-missing')) {
					fetch(url, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						cache: 'force-cache',
						next: {
							revalidate: 3600,
							tags: ['translations'],
						},
						body: JSON.stringify(payload),
					})
						.then(async (response) => {
							if (!response.ok) throw new Error('Network response was not ok');
							const result = await response.json();
							callback(undefined, { status: response.status, data: result });
						})
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
