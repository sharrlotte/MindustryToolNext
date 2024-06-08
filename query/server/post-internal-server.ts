import { toForm } from '@/lib/utils';
import { PostInternalServerRequest } from '@/types/request/PostInternalServerRequest';
import PostServerResponse from '@/types/response/PostServerResponse';

import { AxiosInstance } from 'axios';

export default async function postInternalServer(
  axios: AxiosInstance,
  data: PostInternalServerRequest,
): Promise<PostServerResponse> {
  const form = toForm(data);

  const result = await axios.post('/internal-servers', form, {
    data: form,
  });

  return result.data;
}
