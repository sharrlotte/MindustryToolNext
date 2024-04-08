import {
  PaginationSearchQuery,
  searchSchema,
} from '@/types/data/pageable-search-schema';
import { AxiosInstance } from 'axios';

export default async function getTotalMapUpload(
  axios: AxiosInstance,
  params: Omit<PaginationSearchQuery, 'page' | 'items'>,
): Promise<number> {
  const searchParams = searchSchema.parse(params);
  const result = await axios.get('/maps/upload/total', {
    params: { ...searchParams },
  });

  return result.data;
}
