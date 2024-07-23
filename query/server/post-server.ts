import { AxiosInstance } from 'axios';

import PostServerRequest from '@/types/request/PostServerRequest';
import PostServerResponse from '@/types/response/PostServerResponse';

export default async function postServer(
  axios: AxiosInstance,
  data: PostServerRequest,
): Promise<PostServerResponse> {
  const result = await axios.post('/mindustry-servers', data, {
    data,
  });

  return result.data;
}
