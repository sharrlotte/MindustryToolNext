import { AxiosInstance } from 'axios';

import { PaginationSearchQuery } from '@/types/data/pageable-search-schema';
import { Schematic } from '@/types/response/Schematic';

export default async function getSchematics(
  axios: AxiosInstance,
  params: PaginationSearchQuery,
): Promise<Schematic[]> {
  const result = await axios.get('/schematics', {
    params,
  });

  return result.data;
}
