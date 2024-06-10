import { AxiosInstance } from 'axios';

import { PaginationSearchQuery } from '@/types/data/pageable-search-schema';
import { Schematic } from '@/types/response/Schematic';

export default async function getUserSchematics(
  axios: AxiosInstance,
  userId: string,
  params: PaginationSearchQuery,
): Promise<Schematic[]> {
  const result = await axios.get(`/users/${userId}/schematics`, {
    params,
  });

  return result.data;
}
