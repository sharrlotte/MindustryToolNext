import PostServerResponse from '@/types/response/PostServerResponse';

import { AxiosInstance } from 'axios';

export default async function postReloadInternalServer(
  axios: AxiosInstance,
  id: string,
): Promise<PostServerResponse> {
  const result = await axios.post(`/internal-servers/${id}/reload`);

  return result.data;
}
