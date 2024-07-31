import { AxiosInstance } from 'axios';

import { PostServerResponse } from '@/types/response/PostServerResponse';

export default async function postReloadInternalServers(
  axios: AxiosInstance,
): Promise<PostServerResponse> {
  const result = await axios.post('/internal-servers/reload');

  return result.data;
}
