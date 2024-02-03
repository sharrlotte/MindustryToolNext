import PostMapRequest from '@/types/request/PostMapRequest';
import { TagGroups } from '@/types/response/TagGroup';
import { AxiosInstance } from 'axios';

export default async function postMap(
  axios: AxiosInstance,
  { data, tags }: PostMapRequest,
): Promise<void> {
  const form = new FormData();

  form.append('file', data);
  form.append('tags', TagGroups.toString(tags));

  return axios.post('/maps', form, {
    data: form,
  });
}
