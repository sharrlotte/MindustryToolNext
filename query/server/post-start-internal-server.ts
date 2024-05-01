import PostServerResponse from '@/types/response/PostServerResponse';
import { AxiosInstance } from 'axios';

export default async function postStartInternalServers(
  axios: AxiosInstance,
  id: string,
): Promise<PostServerResponse> {
  const result = await axios.post(`/internal-servers/${id}/start`);

  return result.data;
}
