import { AxiosInstance } from 'axios';

import { StatusPaginationSearchQuery } from '@/types/data/pageable-search-schema';
import { Schematic } from '@/types/response/Schematic';

export default async function getMeSchematics(
  axios: AxiosInstance,
  params: StatusPaginationSearchQuery,
): Promise<Schematic[]> {
  const result = await axios.get(`/users/@me/schematics`, {
    params,
  });

  return result.data;
}
