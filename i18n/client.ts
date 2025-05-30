'use client';

import i18next, { InitOptions } from 'i18next';
import LanguageDetector, { DetectorOptions } from 'i18next-browser-languagedetector';
import Backend, { ChainedBackendOptions } from 'i18next-chained-backend';
import HttpApi, { HttpBackendOptions } from 'i18next-http-backend';
import LocalStorageBackend from 'i18next-localstorage-backend';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { cache, useCallback, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { initReactI18next, useTranslation as useTranslationOrg } from 'react-i18next';

import env from '@/constant/env';
import { Locale, cookieName, defaultLocale, defaultNamespace, i18nCachePrefix, locales } from '@/i18n/config';

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
		signal: AbortSignal.timeout(process.env.NODE_ENV === 'production' ? 3000 : 100),
	}).then(async (res) => {
		if (!res.ok) {
			throw new Error('Failed to fetch data');
		}

		return await res.json();
	}),
);

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
					expirationTime: 24 * 60 * 60 * 1000,
					prefix: i18nCachePrefix,
				},
				{
					loadPath: `${env.url.api}/translations/{{lng}}/{{ns}}?v=1`,
					addPath: `${env.url.api}/translations/{{lng}}/{{ns}}/create-missing`,
					request(options, url, payload, callback) {
						if (url.includes('create-missing')) {
							fetch(url, {
								method: 'POST',
								cache: 'force-cache',
								next: {
									revalidate: 3600,
									tags: ['translations'],
								},
								headers: {
									'Content-Type': 'application/json',
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
				} as HttpBackendOptions,
			],
		},
	};

	return options;
}

const runsOnServerSide = typeof window === 'undefined';

//
i18next
	.use(LanguageDetector)
	.use(Backend)
	.use(initReactI18next)
	.init({
		...getClientOptions(),
		lng: undefined, // let detect the language on client side
		detection: {
			order: ['path', 'cookie', 'navigator'],
			lookupLocalStorage: 'Locale',
			lookupCookie: 'Locale',
		} satisfies DetectorOptions,
		preload: false,
	});

export default i18next;

export function useI18n(namespace: string | string[] = 'common', options?: any) {
	const { locale } = useParams();
	namespace = Array.isArray(namespace) ? namespace.map((n) => n.toLowerCase()) : namespace.toLowerCase();

	let language = String(locale);

	language = locales.includes(language as any) ? language : defaultLocale;

	const [cookies, setCookie] = useCookies([cookieName]);
	const ret = useTranslationOrg(namespace, options);

	const { i18n, t } = ret;
	if (runsOnServerSide && language && i18n.resolvedLanguage !== language) {
		i18n.changeLanguage(language);
	} else {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const [activeLng, setActiveLng] = useState(i18n.resolvedLanguage);

		// eslint-disable-next-line react-hooks/rules-of-hooks
		useEffect(() => {
			if (activeLng === i18n.resolvedLanguage) return;
			setActiveLng(i18n.resolvedLanguage);
		}, [activeLng, i18n.resolvedLanguage]);

		// eslint-disable-next-line react-hooks/rules-of-hooks
		useEffect(() => {
			if (!language || i18n.resolvedLanguage === language) return;
			i18n.changeLanguage(language);

			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [language, i18n.resolvedLanguage]);

		// eslint-disable-next-line react-hooks/rules-of-hooks
		useEffect(() => {
			if (cookies[cookieName] === language) return;

			setCookie(cookieName, language, { path: '/' });
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [language, cookies[cookieName]]);
	}

	const retT = useCallback((key: string, options?: any) => t(key, options) as string, [t]);
	return {
		...ret,
		t: retT,
	};
}

export function useChangeLocale() {
	const [_, setCookie] = useCookies();
	const pathname = usePathname();
	const router = useRouter();
	const params = useSearchParams();

	return (locale: Locale) => {
		const pathnameHasLocale = locales.some((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`);

		const url = pathnameHasLocale ? `/${locale}/${pathname.slice(4)}` : `/${locale}${pathname}`;

		setCookie('Locale', locale, { path: '/' });

		router.push(`${url}?${new URLSearchParams(params).toString()}`);
	};
}
