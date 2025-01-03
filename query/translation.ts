import { AxiosInstance } from 'axios';
import { z } from 'zod';

import { Locale } from '@/i18n/config';
import { PaginationQuerySchema } from '@/query/search-query';
import { TranslationCompare, TranslationDiff } from '@/types/response/Translation';

export async function getTranslationDiff(axios: AxiosInstance, params: PaginationQuery & { language: Locale; target: Locale }): Promise<TranslationDiff[]> {
  const result = await axios.get('/translations/diff', { params });

  return result.data;
}

export async function getTranslationDiffCount(axios: AxiosInstance, params: { language: Locale; target: Locale; key?: string }) {
  const result = await axios.get('/translations/diff/count', {
    params,
  });

  return result.data;
}

export async function getTranslationCompare(axios: AxiosInstance, params: PaginationQuery & { language: Locale; target: Locale }): Promise<TranslationCompare[]> {
  const result = await axios.get('/translations/compare', { params });

  return result.data;
}

export async function getTranslationCompareCount(axios: AxiosInstance, params: { language: Locale; target: Locale; key?: string }) {
  const result = await axios.get('/translations/compare/count', {
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
