import PostServerResponse from '@/types/response/PostServerResponse';
import { AxiosInstance } from 'axios';

export default async function postReloadInternalServers(
  axios: AxiosInstance,
): Promise<PostServerResponse> {
  const result = await axios.post('/internal-servers/reload');

  return result.data;
}
