import {
  PaginationSearchQuery,
  searchSchema,
} from '@/types/data/pageable-search-schema';
import { SchematicPage } from '@/types/response/SchematicPage';
import { AxiosInstance } from 'axios';

export default async function getSchematics(
  axios: AxiosInstance,
  params: PaginationSearchQuery,
): Promise<SchematicPage> {
  const searchParams = searchSchema.parse(params);
  const result = await axios.get('/schematics', {
    params: { ...searchParams, items: 20 },
  });

  return result.data;
}
