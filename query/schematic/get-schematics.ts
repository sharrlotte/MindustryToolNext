import { SearchParams, searchSchema } from '@/types/data/search-schema';
import Schematic from '@/types/response/Schematic';
import { AxiosInstance } from 'axios';

export default async function getSchematics(
  axios: AxiosInstance,
  params: SearchParams,
): Promise<Schematic[]> {
  const searchParams = searchSchema.parse(params);
  const result = await axios.get('/schematics', {
    params: { ...searchParams, items: 20 },
  });

  return result.data;
}
