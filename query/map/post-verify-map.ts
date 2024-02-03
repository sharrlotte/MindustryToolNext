import VerifyMapRequest from '@/types/request/VerifyMapRequest';
import { TagGroups } from '@/types/response/TagGroup';
import { AxiosInstance } from 'axios';

export default async function postVerifyMap(
  axios: AxiosInstance,
  { id, tags }: VerifyMapRequest,
): Promise<void> {
  const form = new FormData();

  form.append('tags', TagGroups.toString(tags));

  return axios.post(`/maps/${id}`, form, {
    data: form,
  });
}
