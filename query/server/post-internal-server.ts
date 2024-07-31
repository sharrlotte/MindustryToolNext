import { AxiosInstance } from 'axios';

import { PostInternalServerRequest } from '@/types/request/PostInternalServerRequest';
import { PostServerResponse } from '@/types/response/PostServerResponse';

export default async function postInternalServer(
  axios: AxiosInstance,
  data: PostInternalServerRequest,
): Promise<PostServerResponse> {
  const result = await axios.post('/internal-servers', data, {
    data,
  });

  return result.data;
}
