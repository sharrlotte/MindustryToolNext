import {
  PaginationSearchQuery,
  searchSchema,
} from '@/types/data/pageable-search-schema';
import { Schematic } from '@/types/response/Schematic';
import { AxiosInstance } from 'axios';

export default async function getUserSchematics(
  axios: AxiosInstance,
  userId: string,
  params: PaginationSearchQuery,
): Promise<Schematic[]> {
  const searchParams = searchSchema.parse(params);
  const result = await axios.get(`/users/${userId}/schematics`, {
    params: searchParams,
  });

  return result.data;
}
