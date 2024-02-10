import {
  PaginationSearchQuery,
  searchSchema,
} from '@/types/data/pageable-search-schema';
import { Schematic } from '@/types/response/Schematic';
import { AxiosInstance } from 'axios';

export default async function getSchematicUploads(
  axios: AxiosInstance,
  params: PaginationSearchQuery,
): Promise<Schematic[]> {
  const searchParams = searchSchema.parse(params);
  const result = await axios.get('/schematics/upload', {
    params: { ...searchParams, items: 20 },
  });

  return result.data;
}
