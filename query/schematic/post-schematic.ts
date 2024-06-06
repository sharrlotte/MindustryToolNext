import PostSchematicRequest from '@/types/request/PostSchematicRequest';
import { AxiosInstance } from 'axios';

export default async function postSchematic(
  axios: AxiosInstance,
  { data, tags }: PostSchematicRequest,
): Promise<void> {
  const form = new FormData();

  if (typeof data === 'string') {
    form.append('code', data);
  } else if (data instanceof File) {
    form.append('file', data);
  }
  form.append('tags', tags);

  return axios.post('/schematics', form, {
    data: form,
  });
}
