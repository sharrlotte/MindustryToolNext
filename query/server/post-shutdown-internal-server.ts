import PostServerResponse from '@/types/response/PostServerResponse';
import { AxiosInstance } from 'axios';

export default async function postShutdownInternalServers(
  axios: AxiosInstance,
  id: string,
): Promise<PostServerResponse> {
  const result = await axios.post(`/internal-servers/${id}/shutdown`);

  return result.data;
}
