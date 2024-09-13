import { Locale } from '@/i18n/config';
import { PaginationQuery } from '@/types/data/pageable-search-schema';
import {
  TranslationDiff,
  TranslationCompare,
} from '@/types/response/Translation';
import { AxiosInstance } from 'axios';
import { z } from 'zod';

export async function getTranslation(
  axios: AxiosInstance,
  params: PaginationQuery & { language: Locale },
): Promise<Record<string, string>[]> {
  const result = await axios.get('/translations', { params });

  return result.data;
}

export async function getTranslationDiff(
  axios: AxiosInstance,
  params: PaginationQuery & { language: Locale },
): Promise<TranslationDiff[]> {
  const result = await axios.get('/translations/diff', { params });

  return result.data;
}

export async function getTranslationDiffCount(
  axios: AxiosInstance,
  language: Locale,
) {
  const result = await axios.get('/translations/diff/count', {
    params: { language },
  });

  return result.data;
}

export async function getTranslationCompare(
  axios: AxiosInstance,
  params: PaginationQuery & { language: Locale },
): Promise<TranslationCompare[]> {
  const result = await axios.get('/translations/compare', { params });

  return result.data;
}

export async function getTranslationCompareCount(
  axios: AxiosInstance,
  language: Locale,
) {
  const result = await axios.get('/translations/compare/count', {
    params: { language },
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

export async function createTranslation(
  axios: AxiosInstance,
  payload: CreateTranslationRequest,
) {
  const result = await axios.post('/translations', payload);

  return result.data;
}

export async function deleteTranslation(axios: AxiosInstance, id: string) {
  const result = await axios.delete(`/translations/${id}`);

  return result.data;
}
