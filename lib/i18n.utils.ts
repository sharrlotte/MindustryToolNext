import env from '@/constant/env';
import { Locale, i18nCachePrefix } from '@/i18n/config';

export function clearTranslationCache() {
	for (let i = localStorage.length - 1; i >= 0; i--) {
		const key = localStorage.key(i);
		if (key && key.startsWith(i18nCachePrefix)) {
			localStorage.removeItem(key);
		}
	}
}

export function extractTranslationKey(text: string) {
	if (!text) {
		throw new Error('Bad key: key is empty');
	}

	text = text.toLowerCase();

	const parts = text.split('.');

	if (parts.length === 0) {
		throw new Error('Bad key: ' + text);
	}

	const group = (parts.length === 1 ? 'common' : parts[0]).toLowerCase();
	const key = (parts.length === 1 ? parts[0] : parts[1]).toLowerCase();

	text = `${group}.${key}`;

	return { text, key, group };
}

const hrefLangs: Record<Locale, string> = {
	en: 'en',
	kr: 'ko',
	cn: 'zh',
	jp: 'ja',
	ru: 'ru',
	uk: 'uk',
	vi: 'vi',
};

export function generateAlternate(path: string) {
	return {
		canonical: './',
		languages: Object.fromEntries(
			env.locales.map((lang) => [hrefLangs[lang], env.url.base + `/${lang}/${path}`.replaceAll('//', '/')]),
		),
	};
}
