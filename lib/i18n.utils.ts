import env from "@/constant/env";
import { i18nCachePrefix, Locale } from "@/i18n/config";


export function clearTranslationCache() {
	for (let i = localStorage.length - 1; i >= 0; i--) {
		const key = localStorage.key(i);
		if (key && key.startsWith(i18nCachePrefix)) {
			localStorage.removeItem(key);
		}
	}
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
