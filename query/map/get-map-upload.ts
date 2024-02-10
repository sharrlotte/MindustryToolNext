import {
  PaginationSearchQuery,
  searchSchema,
} from '@/types/data/pageable-search-schema';
import { Map } from '@/types/response/MapDetail';
import { AxiosInstance } from 'axios';

export default async function getMapUploads(
  axios: AxiosInstance,
  params: PaginationSearchQuery,
): Promise<Map[]> {
  const searchParams = searchSchema.parse(params);
  const result = await axios.get('/maps/upload', {
    params: { ...searchParams, items: 20 },
  });

  return result.data;
}
