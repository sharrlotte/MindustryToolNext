import { Locale } from '@/locales/client';
import { PaginationQuery } from '@/types/data/pageable-search-schema';
import { Translation } from '@/types/response/Translation';
import { AxiosInstance } from 'axios';

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
): Promise<Translation[]> {
  const result = await axios.get('/translations/diff', { params });

  return result.data;
}
