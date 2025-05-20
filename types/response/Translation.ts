import { Locale } from '@/i18n/config';

export type TranslationDiff = {
	id: string;
	key: string;
	value: string;
	keyGroup: string;
};

export type TranslationAllValue = {
	id: string;
	value: string;
	isTranslated: boolean;
};

export type TranslationAll = {
	id: string;
	key: string;
	value: Partial<Record<Locale, TranslationAllValue>>;
	keyGroup: string;
};

export type TranslationCompare = {
	id: string;
	keyId: string;
	key: string;
	value: Record<Locale, string>;
	keyGroup: string;
};

export type Translation = {
	id: string;
	keyId: string;
	key: string;
	value: string;
	keyGroup: string;
	language: string;
	isTranslated?: boolean;
};
