import { AxiosInstance } from 'axios';

import { UploadSchematicRequest } from '@/types/schema/zod-schema';

export default async function postSchematic(
  axios: AxiosInstance,
  { data, tags, name, description }: UploadSchematicRequest,
): Promise<void> {
  const form = new FormData();

  if (typeof data === 'string') {
    form.append('code', data);
  } else if (data instanceof File) {
    form.append('file', data);
  }
  form.append('tags', tags);
  form.append('name', name);
  form.append('description', description ?? '');

  return axios.post('/schematics', form, {
    data: form,
  });
}
