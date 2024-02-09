import {
  PaginationSearchQuery,
  searchSchema,
} from '@/types/data/pageable-search-schema';
import { MapPage } from '@/types/response/MapPage';
import { AxiosInstance } from 'axios';

export default async function getMaps(
  axios: AxiosInstance,
  params: PaginationSearchQuery,
): Promise<MapPage> {
  const searchParams = searchSchema.parse(params);
  const result = await axios.get('/maps', {
    params: { ...searchParams, items: 20 },
  });

  return result.data;
}
