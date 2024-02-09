import PostServerRequest from '@/types/request/PostServerRequest';
import PostServerResponse from '@/types/response/PostServerResponse';
import { AxiosInstance } from 'axios';

export default async function postServer(
  axios: AxiosInstance,
  { address }: PostServerRequest,
): Promise<PostServerResponse> {
  const form = new FormData();

  form.append('address', address);

  const result = await axios.post('/mindustry-servers', form, {
    data: form,
  });

  return result.data;
}
