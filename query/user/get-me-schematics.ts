import {
  StatusPaginationSearchQuery,
  searchSchema,
} from '@/types/data/pageable-search-schema';
import { Schematic } from '@/types/response/Schematic';
import { AxiosInstance } from 'axios';

export default async function getMeSchematics(
  axios: AxiosInstance,
  params: StatusPaginationSearchQuery,
): Promise<Schematic[]> {
  const searchParams = searchSchema.parse(params);
  const result = await axios.get(`/users/@me/schematics`, {
    params: { ...searchParams, items: 20 },
  });

  return result.data;
}
