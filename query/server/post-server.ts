import { toForm } from '@/lib/utils';
import PostServerRequest from '@/types/request/PostServerRequest';
import PostServerResponse from '@/types/response/PostServerResponse';
import { AxiosInstance } from 'axios';

export default async function postServer(
  axios: AxiosInstance,
  data: PostServerRequest,
): Promise<PostServerResponse> {
  const form = toForm(data);

  const result = await axios.post('/mindustry-servers', form, {
    data: form,
  });

  return result.data;
}
