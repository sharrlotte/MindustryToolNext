import { AxiosInstance } from 'axios';



import { Locale } from '@/i18n/config';
import { Translation, TranslationAll, TranslationCompare, TranslationDiff } from '@/types/response/Translation';
import { PaginationQuery } from '@/types/schema/search-query';

import { z } from 'zod/v4';

export async function getTranslationDiff(
	axios: AxiosInstance,
	params: PaginationQuery & { language: Locale; target: Locale; key?: string },
): Promise<TranslationDiff[]> {
	const result = await axios.get('/translations/diff', { params });

	return result.data;
}

export async function getTranslationDiffCount(axios: AxiosInstance, params: { language: Locale; target: Locale; key?: string }) {
	const result = await axios.get('/translations/diff/count', {
		params,
	});

	return result.data;
}
export async function getTranslationAll(
	axios: AxiosInstance,
	params: PaginationQuery & { key?: string },
): Promise<TranslationAll[]> {
	const result = await axios.get('/translations/all', { params });

	return result.data;
}

export async function getTranslationAllCount(axios: AxiosInstance, params: { key?: string }) {
	const result = await axios.get('/translations/all/count', {
		params,
	});

	return result.data;
}

export async function getTranslationCompare(
	axios: AxiosInstance,
	params: PaginationQuery & { language: Locale; target: Locale; key?: string },
): Promise<TranslationCompare[]> {
	const result = await axios.get('/translations/compare', { params });

	return result.data;
}

export async function getTranslationCompareCount(
	axios: AxiosInstance,
	params: { language: Locale; target: Locale; key?: string },
) {
	const result = await axios.get('/translations/compare/count', {
		params,
	});

	return result.data;
}
export async function getTranslationSearch(
	axios: AxiosInstance,
	params: PaginationQuery & { language: Locale; key?: string; isTranslated?: boolean | null },
): Promise<Translation[]> {
	const result = await axios.get('/translations/search', { params });

	return result.data;
}

export async function getTranslationSearchCount(
	axios: AxiosInstance,
	params: { language: Locale; key?: string; isTranslated?: boolean | null },
) {
	const result = await axios.get('/translations/search/count', {
		params,
	});

	return result.data;
}

export const CreateTranslationSchema = z.object({
	keyGroup: z.string().min(1).max(20),
	key: z.string().max(60),
	value: z.string().max(1024),
	language: z.string().max(2),
});

export type CreateTranslationRequest = z.infer<typeof CreateTranslationSchema>;

export async function createTranslation(axios: AxiosInstance, payload: CreateTranslationRequest) {
	const result = await axios.post('/translations', payload);

	return result.data;
}

export async function deleteTranslation(axios: AxiosInstance, id: string) {
	const result = await axios.delete(`/translations/${id}`);

	return result.data;
}
