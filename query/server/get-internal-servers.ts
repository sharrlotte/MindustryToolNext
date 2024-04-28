import { InternalServerDetail } from '@/types/response/InternalServerDetail';
import { AxiosInstance } from 'axios';

export default async function getInternalServers(
  axios: AxiosInstance,
): Promise<InternalServerDetail[]> {
  const result = await axios.get(`/internal-servers`);

  return result.data;
}
