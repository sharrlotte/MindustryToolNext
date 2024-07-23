import { AxiosInstance } from 'axios';

import PostSchematicRequest from '@/types/request/PostSchematicRequest';

export default async function postSchematic(
  axios: AxiosInstance,
  { data, tags, name, description }: PostSchematicRequest,
): Promise<void> {
  const form = new FormData();

  if (typeof data === 'string') {
    form.append('code', data);
  } else if (data instanceof File) {
    form.append('file', data);
  }
  form.append('tags', tags);
  form.append('name', name);
  form.append('description', description);

  return axios.post('/schematics', form, {
    data: form,
  });
}
