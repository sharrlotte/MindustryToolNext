import { ServerInstanceDetail } from '@/types/response/ServerInstanceDetail';
import { AxiosInstance } from 'axios';

export default async function getServerInstances(
  axios: AxiosInstance,
): Promise<ServerInstanceDetail[]> {
  const result = await axios.get(`/mindustry-servers/instances`);

  return result.data;
}
