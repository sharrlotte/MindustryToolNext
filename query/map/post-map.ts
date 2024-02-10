import { toForm } from '@/lib/utils';
import PostMapRequest from '@/types/request/PostMapRequest';
import { AxiosInstance } from 'axios';

export default async function postMap(
  axios: AxiosInstance,
  data: PostMapRequest,
): Promise<void> {
  const form = toForm(data);

  return axios.post('/maps', form, {
    data: form,
  });
}
