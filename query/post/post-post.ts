import { toForm } from '@/lib/utils';
import PostPostRequest from '@/types/request/PostPostRequest';
import { AxiosInstance } from 'axios';

export default async function postMap(
  axios: AxiosInstance,
  data: PostPostRequest,
): Promise<void> {
  const form = toForm(data);

  return axios.post('/posts', form, {
    data: form,
  });
}
