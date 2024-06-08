import { IdSearchParams } from '@/types/data/id-search-schema';
import { SchematicDetail } from '@/types/response/SchematicDetail';

import { AxiosInstance } from 'axios';

export default async function getSchematic(
  axios: AxiosInstance,
  { id }: IdSearchParams,
): Promise<SchematicDetail> {
  const result = await axios.get(`/schematics/${id}`);
  return result.data;
}
