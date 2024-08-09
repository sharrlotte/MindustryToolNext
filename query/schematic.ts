import { AxiosInstance } from 'axios';

import SchematicPreviewRequest from '@/types/request/SchematicPreviewRequest';
import { SchematicPreviewResponse } from '@/types/response/SchematicPreviewResponse';
import { PaginationSearchQuery } from '@/types/data/pageable-search-schema';

export async function getSchematicCount(
  axios: AxiosInstance,
  params: PaginationSearchQuery,
): Promise<number> {
  const result = await axios.get('/schematics/total', { params });

  return result.data;
}

export async function getUploadSchematicCount(
  axios: AxiosInstance,
  params: PaginationSearchQuery,
): Promise<number> {
  const result = await axios.get('/schematics/upload/total', { params });

  return result.data;
}

export async function getSchematicPreview(
  axios: AxiosInstance,
  { data }: SchematicPreviewRequest,
): Promise<SchematicPreviewResponse> {
  const form = new FormData();

  if (typeof data === 'string') {
    form.append('code', data);
  } else if (data instanceof File) {
    form.append('file', data);
  } else {
    throw new Error('Invalid data');
  }

  const result = await axios.post('/schematics/preview', form, {
    data: form,
  });

  return result.data;
}
