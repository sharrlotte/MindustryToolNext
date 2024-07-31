import { AxiosInstance } from 'axios';

import { PostServerResponse } from '@/types/response/PostServerResponse';

export default async function postShutdownInternalServers(
  axios: AxiosInstance,
  id: string,
): Promise<PostServerResponse> {
  const result = await axios.post(`/internal-servers/${id}/shutdown`);

  return result.data;
}
