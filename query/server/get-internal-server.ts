import { IdSearchParams } from '@/types/data/id-search-schema';
import { InternalServerDetail } from '@/types/response/InternalServerDetail';
import { AxiosInstance } from 'axios';

export default async function getInternalServer(
  axios: AxiosInstance,
  { id }: IdSearchParams,
): Promise<InternalServerDetail> {
  const result = await axios.get(`/internal-servers/${id}`);

  return result.data;
}
